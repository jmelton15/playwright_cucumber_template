// const report = require("custom-cucumber-reporter")
const {GenerateReport} = require("../../PostTestScripts/CustomReporter/lib/generate-report")
const {DateTime} = require("luxon");

function getDate() {
  const now = DateTime.now().setZone(`EST`); // EST 
  return now.toFormat('MMMM d, yyyy, h:mm a z');
}

GenerateReport({
  fileName:`Test.html`,
  jsonDir: "test-results/report/",
  reportPath: "test-results/report/",
  metadata: {
    browser: {
      name: "chrome",
      version:""
    },
    platform: {
      name:"test-platform",
      version:""
    }
  },
  customData: {
    title: "Run info",
    data: [
      { label: "Project", value: "Custom project" },
      { label: "Release", value: "1.2.3" },
      { label: "Execution Start Time", value: `${getDate()}` }
    ],
  },
});