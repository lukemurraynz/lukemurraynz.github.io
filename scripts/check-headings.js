#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * SEO Heading Hierarchy Checker and Fixer
 * 
 * This script analyzes markdown files to ensure proper heading hierarchy:
 * - Only one H1 per document (title in frontmatter counts as H1)
 * - H2 should follow H1, H3 should follow H2, etc.
 * - No skipping heading levels
 */

const BLOG_DIR = path.join(__dirname, '..', 'blog');

function extractHeadingsFromMarkdown(content) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const lineNumber = content.substr(0, match.index).split('\n').length;
    
    headings.push({
      level,
      text,
      lineNumber,
      original: match[0]
    });
  }

  return headings;
}

function hasFrontmatterTitle(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return false;
  
  const frontmatter = frontmatterMatch[1];
  return /^title:\s*.+$/m.test(frontmatter);
}

function analyzeHeadingHierarchy(headings, hasTitle) {
  const issues = [];
  let expectedLevel = hasTitle ? 2 : 1; // If frontmatter has title, start from H2

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    
    // Check for H1 when title exists in frontmatter
    if (hasTitle && heading.level === 1) {
      issues.push({
        type: 'multiple_h1',
        line: heading.lineNumber,
        message: `H1 found but title exists in frontmatter. Consider changing to H2.`,
        heading
      });
    }
    
    // Check for proper hierarchy
    if (heading.level > expectedLevel) {
      issues.push({
        type: 'skipped_level',
        line: heading.lineNumber,
        message: `Heading level ${heading.level} skips level ${expectedLevel}. Expected H${expectedLevel} but found H${heading.level}.`,
        heading,
        suggestedLevel: expectedLevel
      });
    }
    
    expectedLevel = Math.min(heading.level + 1, 6);
  }

  return issues;
}

function fixHeadingIssues(content, issues) {
  let fixedContent = content;
  
  // Sort issues by line number in descending order to maintain line numbers
  const sortedIssues = issues.sort((a, b) => b.line - a.line);
  
  for (const issue of sortedIssues) {
    if (issue.type === 'multiple_h1') {
      // Convert H1 to H2
      const newHeading = '##' + issue.heading.original.substring(1);
      fixedContent = fixedContent.replace(issue.heading.original, newHeading);
    } else if (issue.type === 'skipped_level' && issue.suggestedLevel) {
      // Fix skipped levels by adjusting to suggested level
      const newHeading = '#'.repeat(issue.suggestedLevel) + ' ' + issue.heading.text;
      fixedContent = fixedContent.replace(issue.heading.original, newHeading);
    }
  }
  
  return fixedContent;
}

function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const headings = extractHeadingsFromMarkdown(content);
    const hasTitle = hasFrontmatterTitle(content);
    const issues = analyzeHeadingHierarchy(headings, hasTitle);
    
    return {
      filePath,
      headings,
      hasTitle,
      issues,
      content
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

function getAllMarkdownFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function main() {
  console.log('🔍 Analyzing heading hierarchy in blog posts...\n');
  
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }
  
  const markdownFiles = getAllMarkdownFiles(BLOG_DIR);
  console.log(`Found ${markdownFiles.length} markdown files\n`);
  
  let totalIssues = 0;
  let fixedFiles = 0;
  const shouldFix = process.argv.includes('--fix');
  
  for (const filePath of markdownFiles) {
    const result = processMarkdownFile(filePath);
    
    if (!result) continue;
    
    const { issues, content } = result;
    const relativePath = path.relative(process.cwd(), filePath);
    
    if (issues.length > 0) {
      console.log(`📄 ${relativePath}`);
      
      for (const issue of issues) {
        console.log(`   ⚠️  Line ${issue.line}: ${issue.message}`);
        totalIssues++;
      }
      
      if (shouldFix) {
        const fixedContent = fixHeadingIssues(content, issues);
        if (fixedContent !== content) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          console.log(`   ✅ Fixed ${issues.length} heading issues`);
          fixedFiles++;
        }
      }
      
      console.log('');
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files analyzed: ${markdownFiles.length}`);
  console.log(`   Total issues found: ${totalIssues}`);
  
  if (shouldFix) {
    console.log(`   Files fixed: ${fixedFiles}`);
  } else {
    console.log(`\n💡 Run with --fix to automatically fix these issues:`);
    console.log(`   node scripts/check-headings.js --fix`);
  }
  
  if (totalIssues > 0 && !shouldFix) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  extractHeadingsFromMarkdown,
  analyzeHeadingHierarchy,
  fixHeadingIssues
};