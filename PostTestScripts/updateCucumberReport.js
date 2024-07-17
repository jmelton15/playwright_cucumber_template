const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const {DateTime} = require("luxon");


const SOURCE_DIR = './test-results/' 
let ARCHIVE_DIR = './Archived_Tests/'
const TEST_FOLDER_NAME = process.env.CURRENT_APP || `Test_Report_${getDate()}`
const BUILD_TYPE = process.env.BUILD_TYPE || "test"

updateAndArchiveCucumberReport();

function getDate() {
    const now = DateTime.now().setZone(`EST`); // EST 
    return now.toFormat('MMMM_d_yyyy_h_mm_ss');
}

async function updateAndArchiveCucumberReport() {
    console.log("*** Updating Cucumber Report File With Readable Errors ***")
    const dirPath = `${SOURCE_DIR}report/features`
    const cachedLineNums = await getCachedLineNums();
    try {
        const files = fs.readdirSync(dirPath);
        files.forEach((file) => {
            if(file.endsWith('.html')) {
                const filePath = path.join(dirPath, file);
                let html = fs.readFileSync(filePath);
                const $ = cheerio.load(html);
                let tagIndex = 0;
                $('pre').each(function() {
                    const tag = $(this);
                    const errorMessage = getErrorString(tag.text());
                    tag.text(addLineNumsToError(cachedLineNums,errorMessage,tagIndex));
                    tagIndex += 1;
                })
    
                fs.writeFileSync(filePath,$.html());
                console.log(`\nFile updated: ${filePath}\n`);
            }
        })
        if(BUILD_TYPE === "test") {
            ARCHIVE_DIR = `${ARCHIVE_DIR}${TEST_FOLDER_NAME}`
            await fsPromise.mkdir(ARCHIVE_DIR)
            await archiveTestResults(SOURCE_DIR,ARCHIVE_DIR);
        }
    } catch(err) {
        console.error(`There was an error trying to read and write to files in directory: ${dirPath}\nError: ${err}`);
    }
}

async function archiveTestResults(srcDir, destDir) {
    try {
        await fsPromise.mkdir(destDir, {recursive:true})
        const entries = await fsPromise.readdir(srcDir, {withFileTypes: true})

        for(const entry of entries) {
            const srcPath = path.join(srcDir,entry.name);
            const archivePath = path.join(destDir,entry.name);

            if(entry.isDirectory()) {
                await archiveTestResults(srcPath,archivePath);
            } else if(entry.isFile()) {
                await fsPromise.copyFile(srcPath,archivePath)
            }
        }
        console.log(`Copied Test Archives at ${destDir}`)
    } catch(err) {
        console.error(`There was a problem copying to archives.\nError: ${err}`)
    }
}


function addLineNumsToError(lineNums,errorMessage,index) {
    return errorMessage += `\n**********\nExcel Line Numbers: ${lineNums[index]['ExcelFileLineNums']}\nFeature File Line Numbers: ${lineNums[index]['FeatureFileLineNums']}\n**********\n`
}

async function getCachedLineNums() {
    const lineNumCachePath = process.env.LINE_NUM_CACHE_PATH
    try {
        const data = await fsPromise.readFile(lineNumCachePath, 'utf8');
  
        if (!data || data.length === 0) {
          console.log('NO DATA');
          return false;
        }
  
        const parsedJson = JSON.parse(data);

        return parsedJson;
      } catch (err) {
        console.error(`Error reading/parsing file: ${err.message}`);
        return [];
      }
}