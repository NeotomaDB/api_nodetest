'use strict';

// scripts/convert-to-template.js
const fs = require('fs');
const yaml = require('js-yaml');

// Define your dynamic content mappings
const DYNAMIC_MAPPINGS = {
  // Format: 'PLACEHOLDER': 'database_vocabulary_name'
  '__STATUS_ENUM_VALUES__': 'user_status_vocabulary',
  '__ROLE_ENUM_VALUES__': 'user_role_vocabulary',
  '__CATEGORY_ENUM_VALUES__': 'category_vocabulary',
  '__PRIORITY_ENUM_VALUES__': 'priority_vocabulary'
};

/**
 * Description
 * @description Loads the hardcoded OpenAPI v3.0 documentation 
 *   and replaces key elements with placeholders that can be filled
 *   using API calls from the database.
 * @returns {any}
 */
function convertToTemplate() {
  // Read your current OpenAPI file
  const hardcoded = fs.readFileSync('swagger.yaml', 'utf8');

  // Create template by replacing known enum arrays with placeholders
  let template = hardcoded;

  // You'll need to identify these patterns in your actual file
  // This is just an example - you'll customize based on your actual enums
  const replacements = [
    {
      // Replace actual enum arrays with placeholders
      pattern: /enum:\s*\n\s*- "active"\n\s*- "inactive"\n\s*- "pending"/g,
      replacement: 'enum: __STATUS_ENUM_VALUES__'
    },
    {
      pattern: /enum:\s*\n\s*- "admin"\n\s*- "user"\n\s*- "moderator"/g,
      replacement: 'enum: __ROLE_ENUM_VALUES__'
    };
  ];

  replacements.forEach(({ pattern, replacement }) => {
    template = template.replace(pattern, replacement);
  });
  
  // Write the template
  fs.writeFileSync('openapi-template.yaml', template);
  console.log('Template created successfully!');
  
  // Create a mapping file for reference
  fs.writeFileSync('enum-mappings.json', JSON.stringify(DYNAMIC_MAPPINGS, null, 2));
  console.log('Enum mappings saved to enum-mappings.json');
}

convertToTemplate();