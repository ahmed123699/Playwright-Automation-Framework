import * as fs from 'fs';

const xmlPath = './xray-report.xml';
let xml = fs.readFileSync(xmlPath, 'utf-8');


// Split into testcase blocks (including the tags)
const testcaseBlocks = xml.split(/(?=<testcase )/g);

for (let i = 0; i < testcaseBlocks.length; i++) {
  let block = testcaseBlocks[i];

  // Helper to extract test key and summary from the name attribute
  function extractKeyAndSummary(block: string) {
    const nameAttrMatch = block.match(/name="([\s\S]*?)" classname=/);
    const nameAttr = nameAttrMatch ? nameAttrMatch[1] : '';
    // Match CTEST-XXX or CTEST-XXX-YYY format, and CP-XXX or CP-XXX-YYY format
    const testKeyMatch = nameAttr.match(/CTEST-\d+(-\w+)*|CP-\d+(-\w+)*/);
    let testKey = 'UNKNOWN';
    if (testKeyMatch) {
      // Extract base test key (remove any suffix if present)
      const fullMatch = testKeyMatch[0];
      const baseMatch = fullMatch.match(/CTEST-\d+|CP-\d+/);
      testKey = baseMatch ? baseMatch[0] : fullMatch;
    }
    let summary = '';
    const summaryLine = nameAttr.split(/\r?\n/).find(line => line.trim().startsWith('Summary:'));
    if (summaryLine) {
      const match = summaryLine.match(/Summary: &apos;([^']*)&apos;/);
      summary = match ? match[1] : '';
    }
    return { testKey, summary };
  }

  // Only process blocks with <skipped>
  if (block.includes('<skipped')) {
    // Remove all <properties>...</properties>
    block = block.replace(/<properties>[\s\S]*?<\/properties>/g, '');
    const { testKey, summary } = extractKeyAndSummary(block);
    // Insert <properties> before <skipped>
    block = block.replace(
      /(<skipped[\s\S]*?>)/,
      `<properties>\n  <property name="test_key" value="${testKey}">\n  </property>\n  <property name="test_summary" value="${summary}">\n  </property>\n</properties>\n$1`
    );
    testcaseBlocks[i] = block;
    continue;
  }

  // For failed test cases (with <failure>), add <properties> if not present
  if (block.includes('<failure') && !block.includes('<properties>')) {
    const { testKey, summary } = extractKeyAndSummary(block);
    // Insert <properties> after the opening <testcase ...> tag
    block = block.replace(
      /(\<testcase[\s\S]*?\>)/,
      `$1\n<properties>\n  <property name="test_key" value="${testKey}">\n  </property>\n  <property name="test_summary" value="${summary}">\n  </property>\n</properties>`
    );
    testcaseBlocks[i] = block;
    continue;
  }

  // For all other test cases (including passing ones), replace existing test_key if it has currency suffix
  if (block.includes('<properties>') && block.includes('test_key')) {
    const { testKey } = extractKeyAndSummary(block);
    // Replace the test_key property value
    block = block.replace(
      /<property name="test_key" value="[^"]*">/,
      `<property name="test_key" value="${testKey}">`
    );
    testcaseBlocks[i] = block;
    continue;
  }

  // Otherwise, leave the block unchanged
}

// Re-join and write back
const newXml = testcaseBlocks.join('');
fs.writeFileSync(xmlPath, newXml);
console.log('✅ xray-report.xml cleaned'); 