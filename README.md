# JS-MediaPlayer

Convenient media playback with powerful controls in JavaScript

## Installation

 * In the browser

   ```html
   <script type="text/javascript" src="dist/MediaPlayer.min.js"></script>
   ```

## Usage

 * Creating a new instance

   ```html
   <!-- HTML -->
   <form>
       <input type="file" accept="video/*" id="my-file-input">
   </form>
   <video controls="controls" id="my-video"></video>
   ```

   and

   ```javascript
   // JavaScript
   var player = new MediaPlayer();
   player.setTargetElement(document.getElementById("my-video"));
   ```

 * Loading a video or audio file

   ```javascript
   player.load(document.getElementById("my-file-input").files[0]);
   ```

 * Controlling playback

   ```javascript
   player.play();
   // or
   player.resume();
   // or
   player.togglePlaying();
   // or
   player.pause();
   // or
   player.stop();
   ```

 * Checking playback status

   ```javascript
   var playing = player.isPlaying();
   // or
   var ended = player.hasEnded();
   // or
   var elapsedSeconds = player.getElapsedTime();
   // or
   var remainingSeconds = player.getRemainingTime();
   // or
   var totalSeconds = player.getTotalTime();
   // or
   var relativeProgress = player.getProgress();
   ```

 * Fast-forwarding

   ```javascript
   player.seek(25 /* seconds */);
   // or
   player.seekTo(3600 /* seconds */);
   ```

 * Controlling speed

   ```javascript
   var speed = player.getSpeed();
   // or
   player.increaseSpeed(1);
   // or
   player.increaseSpeed(0.35);
   // or
   player.decreaseSpeed(2);
   // or
   player.decreaseSpeed(1.55);
   ```

 * Controlling volume

   ```javascript
   var volume = player.getVolume();
   // or
   player.increaseVolume(0.2);
   // or
   player.decreaseVolume(0.5);
   ```

## Contributing

All contributions are welcome! If you wish to contribute, please create an issue first so that your feature, problem or question can be discussed.

## License

```
Copyright (c) delight.im <info@delight.im>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
