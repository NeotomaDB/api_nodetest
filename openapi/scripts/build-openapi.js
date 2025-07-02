'use strict';

// scripts/build-openapi.js
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

/**
 * Takes the openapi.yaml file and populates any missing fields using the
 * components within the openAPI folder, as defined by the user. This
 * way we can build elements dynamically, and ensure that the documentation
 * is up to date as we develop.
 */
function buildOpenAPI() {
  console.log('🔄 Building OpenAPI specification...');

  // Create the `dist` folder (for distribution) if the
  // `dist` folder does not exist.
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // Load the main openapi.yaml file, with its placeholders.
  const mainSpec = yaml.load(fs.readFileSync('openapi-template.yaml', 'utf8'));

  // We've split out the files for paths, and components:
  const toBuild = {paths: './paths',
    parameters: './components/parameters',
    schemas: './components/schemas',
    responses: './components/responses',
  };

  /**
   * For each YAML element, parse through the associated directory and add
   * each individual element. This allows us to split up our files efficiently.
   * This is a recursive function, it goes into each subdirectory.
   * @param {string} dir
   * @return {array}
   */
  function findYamlElements(dir) {
    let yamlElements = [];
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        yamlElements.push(findYamlElements(fullPath));
      } else if (item.endsWith('.yaml') || item.endsWith('.yml')) {
        yamlElements.push(fullPath);
      }
    });
    return yamlElements;
  }

  // Load in all the different section's files:
  // This will give us `useFiles` which tells us which files are associated
  // with each section.
  Object.keys(toBuild).forEach((key) => {
    console.log(`📝 Loading paths for the ${key} section...`);
    const outputs = findYamlElements(toBuild[key]).flat();
    outputs.forEach((file) => {
      console.log(`  📝 Loading paths from ${file}...`);
      try {
        const pathSpec = yaml.load(fs.readFileSync(file, 'utf8'));
        if (pathSpec && typeof pathSpec === 'object') {
          if (key === 'paths') {
            Object.assign(mainSpec[key], pathSpec);
            console.log(`✅ Added ${Object.keys(pathSpec).length} paths from ${file}`);
          } else {
            Object.assign(mainSpec.components[key], pathSpec);
            console.log(`✅ Added ${Object.keys(pathSpec).length} components from ${file}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error loading ${file}:`, error.message);
      }
    });
  });

  // Write combined spec
  const outputFile = '../openapi.yaml';
  fs.writeFileSync(outputFile, yaml.dump(mainSpec, {
    indent: 2,
    lineWidth: 120,
    noRefs: false,
  }));

  console.log(`🎉 OpenAPI spec built successfully!`);
  console.log(`📄 Total paths: ${Object.keys(mainSpec.paths).length}`);
  console.log(`📄 Total schemas: ${Object.keys(mainSpec.components.schemas).length}`);
  console.log(`📄 Total parameters: ${Object.keys(mainSpec.components.parameters).length}`);
  console.log(`📄 Total responses: ${Object.keys(mainSpec.components.responses).length}`);
  console.log(`📁 Output: ${outputFile}`);
}

// Handle errors gracefully
try {
  buildOpenAPI();
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
};
