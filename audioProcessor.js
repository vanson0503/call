class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const output = outputs[0];
  
      for (let channel = 0; channel < input.length; ++channel) {
        const inputData = input[channel];
        const outputData = output[channel];
  
        for (let i = 0; i < inputData.length; ++i) {
          outputData[i] = inputData[i];
        }
      }
  
      return true;
    }
  }
  
  registerProcessor('audio-processor', AudioProcessor);
  