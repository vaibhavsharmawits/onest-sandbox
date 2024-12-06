//yaml to json script 

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { log } = require("console");

// Define the root directory where your YAML files are located
const rootDirectory = path.join(
  __dirname,
  "../Examples/Services_Work_Opportunities_yaml"
);

// Function to convert a YAML file to JSON
function convertYamlToJson(yamlFilePath, jsonFilePath) {
  try {
    // Read the YAML file
    const yamlContent = fs.readFileSync(yamlFilePath, "utf8");

    // Parse the YAML content to a JavaScript object
    const yamlObject = yaml.load(yamlContent);

    // Convert the JavaScript object to JSON
    const jsonContent = JSON.stringify(yamlObject, null, 2);

    // Write the JSON content to a file
    fs.writeFileSync(jsonFilePath, jsonContent, "utf8");

    console.log(`Converted ${yamlFilePath} to ${jsonFilePath}`);
  } catch (err) {
    console.error(`Error converting ${yamlFilePath}:`, err);
  }
}

// Recursively process directories and files
function processDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      // If it's a directory, process it recursively
      processDirectory(filePath);
    } else if (path.extname(file).toLowerCase() === ".yaml" || path.extname(file).toLowerCase() === ".yml") {
      // If it's a YAML file, convert it to JSON
      const jsonFilePath = path.join(
        directoryPath,
        path.basename(file, path.extname(file)) + ".json"
      );
      convertYamlToJson(filePath, jsonFilePath);
    }
  }
}

// Start processing the root directory
processDirectory(rootDirectory);

