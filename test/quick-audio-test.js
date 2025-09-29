#!/usr/bin/env node
/**
 * Quick audio analysis test - simplified version for rapid testing
 */

const { spawn } = require('child_process');
const fs = require('fs');

async function quickTest() {
  console.log('🎵 Quick Audio Analysis Test');
  console.log('================================');
  
  const audioFile = 'temp/audio/1758961239205_29f7ac1b-3eb5-499c-a137-f37bfd90144f.wav';
  
  // Check if file exists
  if (!fs.existsSync(audioFile)) {
    console.log('❌ Test audio file not found:', audioFile);
    return;
  }
  
  console.log('✅ Audio file found');
  console.log('🚀 Starting analysis...');
  
  const startTime = Date.now();
  
  // Run analysis
  const pythonProcess = spawn('node', [
    'scripts/py-runner.cjs',
    'src/audioProcessor/core/audio_analyzer.py',
    'analyze_mix',
    audioFile,
    '--format', 'json'
  ]);
  
  let output = '';
  let errors = '';
  
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
    process.stdout.write('.');
  });
  
  pythonProcess.stderr.on('data', (data) => {
    errors += data.toString();
  });
  
  pythonProcess.on('close', (code) => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(''); // New line after dots
    
    if (code === 0) {
      console.log(`✅ Analysis completed in ${duration}s`);
      
      try {
        const result = JSON.parse(output);
        console.log('📊 Results:');
        
        if (result.frequency_balance) {
          console.log(`   Frequency Balance: ${result.frequency_balance.balance_score?.toFixed(1) || 'N/A'}/100`);
        }
        
        if (result.dynamic_range) {
          console.log(`   Dynamic Range: ${result.dynamic_range.dynamic_range_score?.toFixed(1) || 'N/A'}/100`);
        }
        
        if (result.stereo_field) {
          console.log(`   Stereo Width: ${result.stereo_field.width_score?.toFixed(1) || 'N/A'}/100`);
        }
        
        if (result.clarity) {
          console.log(`   Clarity: ${result.clarity.clarity_score?.toFixed(1) || 'N/A'}/100`);
        }
        
        if (result.harmonic_content && result.harmonic_content.key !== 'Unknown') {
          console.log(`   Musical Key: ${result.harmonic_content.key}`);
        }
        
      } catch (parseError) {
        console.log('⚠️  Analysis completed but output format unexpected');
        console.log('Raw output preview:', output.substring(0, 200));
      }
      
    } else {
      console.log(`❌ Analysis failed (exit code: ${code})`);
      if (errors) {
        console.log('Errors:', errors);
      }
    }
  });
}

if (require.main === module) {
  quickTest();
}