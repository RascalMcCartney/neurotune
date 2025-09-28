#!/usr/bin/env node
/**
 * Integration test for audio analysis using the Python runner
 * Tests the analyze_mix function in src/audioProcessor/core/audio_analyzer.py
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  audioFile: 'temp/audio/1758961239205_29f7ac1b-3eb5-499c-a137-f37bfd90144f.wav',
  pythonScript: 'src/core/audio_analyzer.py',
  pythonRunner: 'scripts/py-runner.cjs',
  outputFile: 'temp/test-analysis-output.json',
  timeout: 60000 // 1 minute timeout
};

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('', 'reset');
  log('='.repeat(60), 'cyan');
  log(`  ${message}`, 'bright');
  log('='.repeat(60), 'cyan');
}

function logSection(message) {
  log('', 'reset');
  log(`--- ${message} ---`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function checkPrerequisites() {
  logSection('Checking Prerequisites');
  
  // Check if test audio file exists
  if (!fs.existsSync(TEST_CONFIG.audioFile)) {
    logError(`Test audio file not found: ${TEST_CONFIG.audioFile}`);
    return false;
  }
  logSuccess(`Test audio file found: ${TEST_CONFIG.audioFile}`);
  
  // Check file size
  const stats = fs.statSync(TEST_CONFIG.audioFile);
  logInfo(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  
  // Check if Python script exists
  if (!fs.existsSync(TEST_CONFIG.pythonScript)) {
    logError(`Python script not found: ${TEST_CONFIG.pythonScript}`);
    return false;
  }
  logSuccess(`Python script found: ${TEST_CONFIG.pythonScript}`);
  
  // Check if Python runner exists
  if (!fs.existsSync(TEST_CONFIG.pythonRunner)) {
    logError(`Python runner not found: ${TEST_CONFIG.pythonRunner}`);
    return false;
  }
  logSuccess(`Python runner found: ${TEST_CONFIG.pythonRunner}`);
  
  // Ensure temp directory exists
  const tempDir = path.dirname(TEST_CONFIG.outputFile);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    logInfo(`Created temp directory: ${tempDir}`);
  }
  
  return true;
}

function runPythonAnalysis() {
  return new Promise((resolve, reject) => {
    logSection('Running Python Audio Analysis');
    
    // Prepare arguments for the Python script
    const args = [
      TEST_CONFIG.pythonScript,
      'analyze_mix',
      TEST_CONFIG.audioFile,
      '--detailed',
      '--format', 'json',
      '--output', TEST_CONFIG.outputFile
    ];
    
    logInfo(`Command: node ${TEST_CONFIG.pythonRunner} ${args.join(' ')}`);
    logInfo(`Starting analysis of: ${TEST_CONFIG.audioFile}`);
    
    const startTime = Date.now();
    
    // Spawn the Python process via Node runner
    const pythonProcess = spawn('node', [TEST_CONFIG.pythonRunner, ...args], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });
    
    let stdout = '';
    let stderr = '';
    
    // Collect stdout data
    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      // Log real-time output with indentation
      output.split('\n').forEach(line => {
        if (line.trim()) {
          logInfo(`Python: ${line.trim()}`);
        }
      });
    });
    
    // Collect stderr data
    pythonProcess.stderr.on('data', (data) => {
      const error = data.toString();
      stderr += error;
      // Log errors in real-time
      error.split('\n').forEach(line => {
        if (line.trim()) {
          logWarning(`Python Error: ${line.trim()}`);
        }
      });
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      const processingTime = Date.now() - startTime;
      
      logInfo(`Python process completed with exit code: ${code}`);
      logInfo(`Processing time: ${(processingTime / 1000).toFixed(2)} seconds`);
      
      if (code === 0) {
        logSuccess('Python analysis completed successfully');
        resolve({
          success: true,
          stdout,
          stderr,
          processingTime,
          exitCode: code
        });
      } else {
        logError(`Python analysis failed with exit code: ${code}`);
        resolve({
          success: false,
          stdout,
          stderr,
          processingTime,
          exitCode: code
        });
      }
    });
    
    // Handle process errors
    pythonProcess.on('error', (error) => {
      const processingTime = Date.now() - startTime;
      logError(`Failed to start Python process: ${error.message}`);
      reject({
        success: false,
        error: error.message,
        processingTime
      });
    });
    
    // Set timeout
    const timeout = setTimeout(() => {
      logError(`Analysis timed out after ${TEST_CONFIG.timeout / 1000} seconds`);
      pythonProcess.kill('SIGTERM');
      reject({
        success: false,
        error: 'Analysis timeout',
        processingTime: Date.now() - startTime
      });
    }, TEST_CONFIG.timeout);
    
    // Clear timeout when process completes
    pythonProcess.on('close', () => {
      clearTimeout(timeout);
    });
  });
}

async function parseAnalysisResults() {
  logSection('Parsing Analysis Results');
  
  // Check if output file was created
  if (!fs.existsSync(TEST_CONFIG.outputFile)) {
    logError(`Output file not created: ${TEST_CONFIG.outputFile}`);
    return null;
  }
  
  try {
    const rawData = fs.readFileSync(TEST_CONFIG.outputFile, 'utf8');
    logInfo(`Output file size: ${rawData.length} bytes`);
    
    // Try to parse JSON
    const analysisData = JSON.parse(rawData);
    logSuccess('Successfully parsed analysis results');
    
    return analysisData;
  } catch (error) {
    logError(`Failed to parse output file: ${error.message}`);
    
    // Try to read raw content for debugging
    try {
      const rawContent = fs.readFileSync(TEST_CONFIG.outputFile, 'utf8');
      logInfo('Raw output file content:');
      console.log(rawContent.substring(0, 500) + (rawContent.length > 500 ? '...' : ''));
    } catch (readError) {
      logError(`Could not read output file: ${readError.message}`);
    }
    
    return null;
  }
}

function displayAnalysisResults(analysisData) {
  if (!analysisData) {
    logError('No analysis data to display');
    return;
  }
  
  logSection('Analysis Results Summary');
  
  try {
    // Display frequency balance
    if (analysisData.frequency_balance) {
      logInfo('Frequency Balance:');
      console.log(`  Score: ${analysisData.frequency_balance.balance_score?.toFixed(1) || 'N/A'}/100`);
      
      if (analysisData.frequency_balance.band_energy) {
        console.log('  Band Energy:');
        Object.entries(analysisData.frequency_balance.band_energy).forEach(([band, energy]) => {
          console.log(`    ${band.replace('_', ' ')}: ${energy?.toFixed(1) || 'N/A'}%`);
        });
      }
    }
    
    // Display dynamic range
    if (analysisData.dynamic_range) {
      logInfo('Dynamic Range:');
      console.log(`  Score: ${analysisData.dynamic_range.dynamic_range_score?.toFixed(1) || 'N/A'}/100`);
      console.log(`  Range: ${analysisData.dynamic_range.dynamic_range_db?.toFixed(1) || 'N/A'} dB`);
      console.log(`  Crest Factor: ${analysisData.dynamic_range.crest_factor_db?.toFixed(1) || 'N/A'} dB`);
    }
    
    // Display stereo field
    if (analysisData.stereo_field) {
      logInfo('Stereo Field:');
      console.log(`  Width Score: ${analysisData.stereo_field.width_score?.toFixed(1) || 'N/A'}/100`);
      console.log(`  Phase Score: ${analysisData.stereo_field.phase_score?.toFixed(1) || 'N/A'}/100`);
      console.log(`  Correlation: ${analysisData.stereo_field.correlation?.toFixed(2) || 'N/A'}`);
    }
    
    // Display clarity
    if (analysisData.clarity) {
      logInfo('Clarity:');
      console.log(`  Score: ${analysisData.clarity.clarity_score?.toFixed(1) || 'N/A'}/100`);
      console.log(`  Spectral Contrast: ${analysisData.clarity.spectral_contrast?.toFixed(2) || 'N/A'}`);
      console.log(`  Spectral Centroid: ${analysisData.clarity.spectral_centroid?.toFixed(0) || 'N/A'} Hz`);
    }
    
    // Display harmonic content if available
    if (analysisData.harmonic_content) {
      logInfo('Harmonic Content:');
      console.log(`  Key: ${analysisData.harmonic_content.key || 'Unknown'}`);
      console.log(`  Harmonic Complexity: ${analysisData.harmonic_content.harmonic_complexity?.toFixed(1) || 'N/A'}%`);
      console.log(`  Key Consistency: ${analysisData.harmonic_content.key_consistency?.toFixed(1) || 'N/A'}%`);
    }
    
    // Display transients if available
    if (analysisData.transients) {
      logInfo('Transients:');
      console.log(`  Score: ${analysisData.transients.transients_score?.toFixed(1) || 'N/A'}/100`);
      console.log(`  Attack Time: ${analysisData.transients.attack_time?.toFixed(1) || 'N/A'} ms`);
      console.log(`  Transient Density: ${analysisData.transients.transient_density?.toFixed(2) || 'N/A'} onsets/sec`);
    }
    
  } catch (error) {
    logError(`Error displaying results: ${error.message}`);
    logInfo('Raw analysis data structure:');
    console.log(JSON.stringify(analysisData, null, 2).substring(0, 1000));
  }
}

function generateTestReport(testResult, analysisData, processingTime) {
  logSection('Test Report Generation');
  
  const report = {
    test_metadata: {
      timestamp: new Date().toISOString(),
      audio_file: TEST_CONFIG.audioFile,
      processing_time_ms: processingTime,
      success: testResult.success,
      exit_code: testResult.exitCode
    },
    python_output: {
      stdout_lines: testResult.stdout.split('\n').filter(line => line.trim()),
      stderr_lines: testResult.stderr.split('\n').filter(line => line.trim()),
      stdout_length: testResult.stdout.length,
      stderr_length: testResult.stderr.length
    },
    analysis_results: analysisData,
    test_summary: {
      prerequisites_passed: true,
      python_execution_success: testResult.success,
      analysis_data_parsed: !!analysisData,
      output_file_created: fs.existsSync(TEST_CONFIG.outputFile)
    }
  };
  
  // Save detailed report
  const reportPath = 'temp/audio-analysis-test-report.json';
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    logSuccess(`Detailed test report saved to: ${reportPath}`);
  } catch (error) {
    logError(`Failed to save test report: ${error.message}`);
  }
  
  return report;
}

async function main() {
  logHeader('Audio Analysis Integration Test');
  
  logInfo(`Test file: ${TEST_CONFIG.audioFile}`);
  logInfo(`Python script: ${TEST_CONFIG.pythonScript}`);
  logInfo(`Python runner: ${TEST_CONFIG.pythonRunner}`);
  
  try {
    // Step 1: Check prerequisites
    const prerequisitesOk = await checkPrerequisites();
    if (!prerequisitesOk) {
      logError('Prerequisites check failed. Aborting test.');
      process.exit(1);
    }
    
    // Step 2: Run Python analysis
    const testResult = await runPythonAnalysis();
    
    // Step 3: Parse results
    const analysisData = await parseAnalysisResults();
    
    // Step 4: Display results
    displayAnalysisResults(analysisData);
    
    // Step 5: Generate report
    const report = generateTestReport(testResult, analysisData, testResult.processingTime);
    
    // Step 6: Final assessment
    logSection('Final Test Assessment');
    
    if (testResult.success && analysisData) {
      logSuccess('✨ Audio analysis integration test PASSED!');
      logSuccess(`Analysis completed in ${(testResult.processingTime / 1000).toFixed(2)} seconds`);
      
      // Display key metrics
      if (analysisData.frequency_balance) {
        logInfo(`Frequency Balance Score: ${analysisData.frequency_balance.balance_score?.toFixed(1) || 'N/A'}/100`);
      }
      if (analysisData.dynamic_range) {
        logInfo(`Dynamic Range Score: ${analysisData.dynamic_range.dynamic_range_score?.toFixed(1) || 'N/A'}/100`);
      }
      if (analysisData.harmonic_content && analysisData.harmonic_content.key !== 'Unknown') {
        logInfo(`Detected Key: ${analysisData.harmonic_content.key}`);
      }
      
      logInfo('');
      logInfo('Test files created:');
      logInfo(`  - Analysis output: ${TEST_CONFIG.outputFile}`);
      logInfo(`  - Test report: temp/audio-analysis-test-report.json`);
      
    } else if (testResult.success && !analysisData) {
      logWarning('Python execution succeeded but analysis data could not be parsed');
      logWarning('Check the Python script output format and error messages above');
      process.exit(1);
    } else {
      logError('Audio analysis integration test FAILED');
      logError(`Exit code: ${testResult.exitCode}`);
      
      if (testResult.stderr) {
        logError('Python error output:');
        testResult.stderr.split('\n').forEach(line => {
          if (line.trim()) {
            console.log(`  ${line.trim()}`);
          }
        });
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    logError(`Test execution failed: ${error.message}`);
    
    if (error.processingTime) {
      logInfo(`Failed after ${(error.processingTime / 1000).toFixed(2)} seconds`);
    }
    
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  logWarning('Test interrupted by user');
  process.exit(130);
});

process.on('SIGTERM', () => {
  logWarning('Test terminated');
  process.exit(143);
});

// Run the test
if (require.main === module) {
  main().catch(error => {
    logError(`Unhandled error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = {
  runTest: main,
  config: TEST_CONFIG
};