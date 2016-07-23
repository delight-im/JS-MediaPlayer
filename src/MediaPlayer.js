/*
 * JS-MediaPlayer (https://github.com/delight-im/JS-MediaPlayer)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

/**
 * Convenient media playback with powerful controls in JavaScript
 *
 * @constructor
 */
function MediaPlayer() {

	/**
	 * Target `HTMLMediaElement` that is controlled by this instance
	 *
	 * @type {HTMLMediaElement}
	 * @private
	 */
	this._targetElement = null;

	/**
	 * Sets the target `HTMLMediaElement` that should be controlled by this instance
	 *
	 * @param {HTMLElement} element - the element to control
	 */
	this.setTargetElement = function (element) {
		if (typeof element === "object" && element instanceof HTMLMediaElement) {
			//noinspection JSUnresolvedVariable
			if (element instanceof HTMLVideoElement || element instanceof HTMLAudioElement) {
				this._targetElement = element;
			}
			else {
				throw new MediaPlayer.InvalidArgumentElementException("Target element must be a video or audio element");
			}
		}
		else {
			throw new MediaPlayer.InvalidArgumentElementException("Target element must be an instance of `HTMLMediaElement`");
		}
	};

	/**
	 * Returns whether a target element has already been set for this instance or not
	 *
	 * @return {boolean}
	 * @private
	 */
	this._hasTargetElement = function () {
		return typeof this._targetElement === "object" && this._targetElement !== null;
	};

	/**
	 * Creates an object URL from a given file
	 *
	 * @param {File|Blob} file - the file to create the object URL from
	 * @return {string} the object URL representing the file
	 * @private
	 */
	this._createObjectUrlFromFile = function (file) {
		//noinspection JSUnresolvedVariable
		if (window.webkitURL && window.webkitURL.createObjectURL) {
			//noinspection JSUnresolvedVariable,JSUnresolvedFunction
			return window.webkitURL.createObjectURL(file);
		}
		else {
			//noinspection JSUnresolvedVariable
			if (window.URL && window.URL.createObjectURL) {
				//noinspection JSUnresolvedVariable,JSUnresolvedFunction
				return window.URL.createObjectURL(file);
			}
			else {
				throw new MediaPlayer.BrowserNotSupportedException("Missing support for `Window#URL.createObjectURL`");
			}
		}
	};

	/**
	 * Returns whether a medium with the specified MIME type is playable by this instance or not
	 *
	 * @param {string} mimeType - the MIME type to check
	 * @return {boolean}
	 * @private
	 */
	this._isMediumPlayable = function (mimeType) {
		if (mimeType === "") {
			return true;
		}
		else {
			var response = this._targetElement.canPlayType(mimeType);

			return response === "probably" || response === "maybe";
		}
	};

	/**
	 * Loads a file into this instance that can be played afterwards
	 *
	 * @param {File} file - the file to play
	 * @private
	 */
	this._loadFile = function (file) {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		if (this._isMediumPlayable(file.type)) {
			this._targetElement.src = this._createObjectUrlFromFile(file);
		}
		else {
			throw new MediaPlayer.UnsupportedFormatException();
		}
	};

	/**
	 * Loads arbitrary input into this instance that can be played afterwards
	 *
	 * @param {object} input - the input to load
	 */
	this.load = function (input) {
		if (typeof input === "object") {
			if (input instanceof File) {
				this._loadFile(input);
			}
			else {
				throw new MediaPlayer.InvalidInputException("Input must be of type `File`");
			}
		}
		else {
			throw new MediaPlayer.InvalidInputException("Input must be an object");
		}
	};

	/**
	 * Starts playback of the medium that has been loaded into this instance
	 *
	 * Playback may be paused or stopped later
	 */
	this.play = function () {
		this.resume();
	};

	/**
	 * Resumes playback
	 *
	 * Playback may be paused or stopped later
	 */
	this.resume = function () {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		this._targetElement.play();
	};

	/**
	 * Pauses playback
	 *
	 * Playback may be continued afterwards
	 */
	this.pause = function () {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		this._targetElement.pause();
	};

	/**
	 * Stops playback
	 *
	 * Playback may be re-started afterwards
	 */
	this.stop = function () {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		this.pause();
		this._targetElement.currentTime = 0;
	};

	/**
	 * Returns whether this instance is currently playing or not
	 *
	 * @return {boolean}
	 */
	this.isPlaying = function () {
		return !this._targetElement.paused && !this.hasEnded();
	};

	/** Pauses playback if the medium is currently playing or resumes playback if it has been paused before */
	this.togglePlaying = function () {
		if (this.isPlaying()) {
			this.pause();
		}
		else {
			this.resume();
		}
	};

	/**
	 * Returns whether playback has ended already
	 *
	 * @return {boolean}
	 */
	this.hasEnded = function () {
		return this._targetElement.ended;
	};

	/**
	 * Fast-forwards by the specified number of seconds
	 *
	 * @param {number} addendSeconds - the number of seconds to skip forward
	 */
	this.seek = function (addendSeconds) {
		this._targetElement.currentTime += addendSeconds;
	};

	/**
	 * Fast-forwards to the specified position in seconds
	 *
	 * @param {number} positionSeconds - the position in seconds to skip to
	 */
	this.seekTo = function (positionSeconds) {
		this._targetElement.currentTime = positionSeconds;
	};

	/**
	 * Returns the playback speed as a factor
	 *
	 * @return {number} the speed where `1` is normal speed`, `0.5` is half speed and `2` is double speed
	 */
	this.getSpeed = function () {
		return this._targetElement.playbackRate;
	};

	/**
	 * Increases the playback speed by the specified amount
	 *
	 * @param {number} addend - the amount to increase the speed factor by
	 * @return {number} the new speed
	 */
	this.increaseSpeed = function (addend) {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		// use a default value for the addend if none has been provided
		addend = addend || 0.5;

		// update the speed
		this._targetElement.playbackRate += addend;

		// return the new speed
		return this._targetElement.playbackRate;
	};

	/**
	 * Decreases the playback speed by the specified amount
	 *
	 * @param {number} subtrahend - the amount to decrease the speed factor by
	 * @return {number} the new speed
	 */
	this.decreaseSpeed = function (subtrahend) {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		// use a default value for the subtrahend if none has been provided
		subtrahend = subtrahend || 0.5;

		// update the speed
		this._targetElement.playbackRate -= subtrahend;

		// return the new speed
		return this._targetElement.playbackRate;
	};

	/**
	 * Returns the playback volume as a value between `0` and `1`
	 *
	 * @return {number} the volume
	 */
	this.getVolume = function () {
		return this._targetElement.volume;
	};

	/**
	 * Increases the playback volume by the specified amount
	 *
	 * @param {number} addend - the amount to increase the volume by
	 * @return {number} the new volume
	 */
	this.increaseVolume = function (addend) {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		// use a default value for the addend if none has been provided
		addend = addend || 0.1;

		// update the volume
		this._targetElement.volume = Math.min(this._targetElement.volume + addend, 1);

		// return the new volume
		return this._targetElement.volume;
	};

	/**
	 * Decreases the playback volume by the specified amount
	 *
	 * @param {number} subtrahend - the amount to decrease the volume by
	 * @return {number} the new volume
	 */
	this.decreaseVolume = function (subtrahend) {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		// use a default value for the subtrahend if none has been provided
		subtrahend = subtrahend || 0.1;

		// update the volume
		this._targetElement.volume = Math.max(this._targetElement.volume - subtrahend, 0);

		// return the new volume
		return this._targetElement.volume;
	};

	/**
	 * Returns the elapsed playback time
	 *
	 * @return {number} the elapsed time in seconds
	 */
	this.getElapsedTime = function () {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		return this._targetElement.currentTime;
	};

	/**
	 * Returns the remaining playback time
	 *
	 * @return {number} the remaining time in seconds
	 */
	this.getRemainingTime = function () {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		return this._targetElement.duration - this._targetElement.currentTime;
	};

	/**
	 * Returns the total playback time
	 *
	 * @return {number} the total time in seconds
	 */
	this.getTotalTime = function () {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		return this._targetElement.duration;
	};

	/**
	 * Returns the relative progress of playback
	 *
	 * @return {number} the progress as a number between 0 and 1
	 */
	this.getProgress = function () {
		if (!this._hasTargetElement()) {
			throw new MediaPlayer.MissingTargetElementException();
		}

		return this._targetElement.currentTime / this._targetElement.duration;
	};

}

/**
 * Exception that is thrown when invalid input has been provided
 *
 * @param {string} reason
 * @constructor
 */
MediaPlayer.InvalidInputException = function (reason) {
	this.reason = reason;
};

/**
 * Exception that is thrown when the user's web browser is not supported
 *
 * @param {string} reason
 * @constructor
 */
MediaPlayer.BrowserNotSupportedException = function (reason) {
	this.reason = reason;
};

/**
 * Exception that is thrown when the target element has not been set yet
 *
 * @constructor
 */
MediaPlayer.MissingTargetElementException = function () { };

/**
 * Exception that is thrown when invalid arguments are passed
 *
 * @param {string} reason
 * @constructor
 */
MediaPlayer.InvalidArgumentElementException = function (reason) {
	this.reason = reason;
};

/**
 * Exception that is thrown when one has tried to play unsupported formats
 * @constructor
 */
MediaPlayer.UnsupportedFormatException = function () { };
