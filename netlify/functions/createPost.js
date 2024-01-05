const admin = require('firebase-admin');
const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');

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
            const fileFields = ['thumb', 'map', 'doc1', 'doc2', 'doc3', 'doc4', 'doc5', 'photos'];
            await Promise.all(fileFields.map(async field => {
                if (postData[field]) {
                    const file = storage.file(`${postData[field]}`);
                    // const url = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' });
                    // postData[field] = url[0];
                    postData[field] = file.name;
                }
            }));
            return { id: doc.id, ...postData };
        }));
        return { statusCode: 200, body: JSON.stringify(data) };
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
                            destination: `uploads/${filename}`
                        });
                        const fileUrl = (await uploadedFile[0].getSignedUrl({ action: 'read', expires: '03-09-2491' }))[0];
                        postData[fieldname] = fileUrl;
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
