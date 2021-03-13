import { PDFDocument }  from 'pdf-lib';
import fs from 'fs';
import { fromPath } from "pdf2pic";


run().catch(err => console.log(err));

async function run() {
 
  let i = 1;
 
  for await (let file of fs.readdirSync('./input')) {
    try {
      const name = await editPDF(`./input/${file}`,i)  
      await imageGenerate(name,i)
      console.log(`${i}: ./input/${file}`);
      i++;
    } catch(error) {
      console.log(error);
    }
    
  }

   
}

function imageGenerate(pathPdf = '', output) {
    return new Promise((resolve,reject) => {
      try {
        console.log('.. imageGenerate ..')
        const options = {
            density: 200,
            saveFilename: output,
            savePath: "./results/images",
            format: "png",
            width: 585,
            height: 842
        };

        const storeAsImage = fromPath(pathPdf, options);
        const pageToConvertAsImage = 1;

        resolve(storeAsImage(pageToConvertAsImage))
      } catch(error) {
        reject(error)
      }
    })
    
}

function editPDF(pathPdf = '', output) {
    return new Promise(async (resolve,reject) => {
      try {
        console.log('.. editPDF ..')
        const doc = await PDFDocument.load(fs.readFileSync(pathPdf))
        const page = doc.getPages();
      
        let imgProfile = fs.readFileSync('./src/profile.jpg');
        imgProfile = await doc.embedJpg(imgProfile);
      
        let imgLink = fs.readFileSync('./src/link.jpg');
        imgLink = await doc.embedJpg(imgLink);
      
        // Draw the image on the center of the page
        const sizeProfile  = imgProfile.scale(1);
        page[0].drawImage(imgProfile, {
          x: page[0].getWidth() / 2 - sizeProfile.width / 2,
          y: page[0].getHeight() - sizeProfile.height * 1.3
        });
      
        const sizeLink = imgLink.scale(1);
        page[0].drawImage(imgLink, {
          x: page[0].getWidth() / 2 - sizeLink.width / 2,
          y: 50  
        });
      
        // Write the PDF to a file
        const nameFile = `/home/matheus/Projetos/pdf2imagegit/results/pdf/${output}.pdf`
        fs.writeFileSync(nameFile, await doc.save());

        resolve(nameFile)
      } catch (err) {
        reject(err)
      }  
    })
}