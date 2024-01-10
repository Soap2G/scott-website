const admin = require('firebase-admin');
const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');

// Get human readable unique folder identifier
const date = new Date();
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');

const uniqueFolder = `${day}${month}${year}${hours}${minutes}${seconds}`;

// Initialize Firebase Admin SDK with your project credentials
const serviceAccount = JSON.parse(process.env.FIREBASE_JSON);
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.STORAGE_BUCKET
    });
}

const db = admin.firestore();
const storage = admin.storage().bucket();

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        // Handle GET request
        const snapshot = await db.collection('posts').get();
        const data = await Promise.all(snapshot.docs.map(async doc => {
            const postData = doc.data();
            const fileFields = ['thumb', 'doc1', 'doc2', 'doc3', 'doc4', 'doc5', 'photos'];
            await Promise.all(fileFields.map(async field => {
                if (postData[field]) {
                  if (field === 'photos' && Array.isArray(postData[field])) {
                    // Handle 'photos' as an array
                    postData[field] = await Promise.all(postData[field].map(async photoPath => {
                      const file = storage.file(photoPath);
                      return file.name;
                    }));
                  } else {
                    // Handle other fields as before
                    const file = storage.file(`${postData[field]}`);
                    postData[field] = file.name;
                  }
                }
            }));
            return { id: doc.id, ...postData };
        }));
        return { statusCode: 200, body: JSON.stringify(data) };
    } else if (event.httpMethod === 'PUT') {
        // Handle PUT request
        return new Promise((resolve, reject) => {
            const busboy = new Busboy({ headers: event.headers, multiples: true });
            const tmpdir = os.tmpdir();
            let updateData = {};
            let fileWrites = [];
            let fieldWrites = [];
            const id = event.path.split('/').pop(); // Assuming the ID is the last part of the path
            const docRef = db.collection('posts').doc(id);

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                if (!filename) return;
    
                const filepath = path.join(tmpdir, filename);
                const writeStream = fs.createWriteStream(filepath);
                file.pipe(writeStream);
    
                fileWrites.push(new Promise((resolve, reject) => {
                    file.on('end', () => writeStream.end());
                    writeStream.on('finish', async () => {
                        const doc = await docRef.get();
                        let updateFolder;
                        if (doc.exists) {
                            updateFolder = doc.data().uniqueFolder;
                          } else {
                            updateFolder = uniqueFolder
                          }
                        try {
                            const uploadedFile = await storage.upload(filepath, {
                                destination: `uploads/${updateFolder}/${filename}`
                            });
                            const fileUrl = (await uploadedFile[0].getSignedUrl({ action: 'read', expires: '03-09-2491' }))[0];
                            // console.log(fileUrl)
                            if (fieldname.startsWith('photo')) {
                                if (!Array.isArray(updateData.photos)) {
                                    updateData.photos = [];
                                }
                                updateData.photos.push(fileUrl);
                            } else {
                                updateData[fieldname] = fileUrl;
                            }
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    });
                    writeStream.on('error', reject);
                }));
            });
    
            busboy.on('field', (fieldname, val) => {
                fieldWrites.push(new Promise((resolve, reject) => {
                    try {
                        updateData[fieldname] = val;
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }));
            });
    
            busboy.on('finish', async () => {
                try {
                    await Promise.all([...fileWrites, ...fieldWrites])
                        .catch(error => {
                            console.error('Error in Promise.all:', error);
                            reject({ statusCode: 500, body: `Error processing request: ${error.message}` });
                            return;
                        });
                    await docRef.update(updateData);
                    resolve({ statusCode: 200, body: JSON.stringify({ id: id, ...updateData }) });
                } catch (error) {
                    reject({ statusCode: 500, body: `Server Error: ${error.message}` });
                }
            });
    
            busboy.end(event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body);
        });

    } else if (event.httpMethod === 'POST') {
        // Handle POST request
        return new Promise((resolve, reject) => {
            const busboy = new Busboy({ headers: event.headers });
            const tmpdir = os.tmpdir();
            let postData = {};
            let fileWrites = [];
            let fieldWrites = [];

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                if (!filename) return;

                const filepath = path.join(tmpdir, filename);
                const writeStream = fs.createWriteStream(filepath);
                file.pipe(writeStream);

                fileWrites.push(new Promise((resolve, reject) => {
                    file.on('end', () => writeStream.end());
                    writeStream.on('finish', async () => {
                        const uploadedFile = await storage.upload(filepath, {
                            destination: `uploads/${uniqueFolder}/${filename}`
                        });
                        const fileUrl = (await uploadedFile[0].getSignedUrl({ action: 'read', expires: '03-09-2491' }))[0];
                        if (fieldname.startsWith('photo')) {
                            if (!Array.isArray(postData.photos)) {
                                postData.photos = [];
                            }
                            postData.photos.push(fileUrl);
                        } else {
                            postData[fieldname] = fileUrl;
                        }
                        resolve();
                    });
                    writeStream.on('error', reject);
                }));
            });

            busboy.on('field', (fieldname, val) => {
                fieldWrites.push(new Promise((resolve, reject) => {
                    try {
                        postData[fieldname] = val;
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }));
            });
            
            busboy.on('finish', async () => {
                try {
                    await Promise.all([...fileWrites, ...fieldWrites])
                        .catch(error => {
                            console.error('Error in Promise.all:', error);
                            // Handle the error as needed
                        });
                    postData['uniqueFolder'] = uniqueFolder;
                    const docRef = await db.collection('posts').add(postData);
                    resolve({ statusCode: 200, body: JSON.stringify({ id: docRef.id, ...postData }) });
                } catch (error) {
                    reject({ statusCode: 500, body: `Server Error: ${error.message}` });
                }
            });
            busboy.end(event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body);
        });
    } else {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
};
