
////////////////////////////////////
// Configurable in Init()

let duration;
let looping;
let cb = {
  onframe:  [],
  onplay:   [],
  onpause:  [],
  onfinish: [],
  onloop:   [],
  onreset:  []
}


////////////////////////////////////
// Internal State

let playing = false;
let finished = false;
let seeking = false;
let wasPlayingBeforeSeek = false;
let percent = 0;
let rafID = null; // sometimes we need to cancel RAFs to prevent the animation speeding up randomly


////////////////////////////////////
// Exported Init

export function setup({ // 'Simulated named paramers' - https://exploringjs.com/js/book/ch_callables.html#simulating-named-parameters
    duration  = 1000,
    looping   = false,
    callbacks = {
      frame:  null,
      play:   null,
      pause:  null,
      finish: null,
      loop:   null,
      reset:  null
    },
  } = {})
{
  if (duration) setDuration(duration);
  if (looping)  setLooping(looping);

  if (callbacks?.frame)  cb.onframe  = callbacks.frame;
  if (callbacks?.play)   cb.onplay   = callbacks.play;
  if (callbacks?.pause)  cb.onpause  = callbacks.pause;
  if (callbacks?.finish) cb.onfinish = callbacks.finish;
  if (callbacks?.loop)   cb.onloop   = callbacks.loop;
  if (callbacks?.reset)  cb.onreset  = callbacks.reset;
}


////////////////////////////////////
// Exported Controls

export function play() {
  // restart from beginning if finished when play started
  if (finished) {
    elapsedTotal = 0;
    percent = 0;
  }

  playing = true;
  finished = false;
  cb.onplay.forEach( f => f(playing, percent) );

  elapsedLoop = 0;
  prevFrame = document.timeline.currentTime;
  rafID = requestAnimationFrame(loop);

  return [playing, percent];
}

export function pause() {
  playing = false;
  cb.onpause.forEach( f => f(playing, percent) );
  return [playing, percent];
}

export function toggle() {
  if (playing) { pause() } else { play() }
  return [playing, percent];
}

export function reset() {
  cancelAnimationFrame(rafID);
  playing = false;
  finished = false;
  percent = 0;
  elapsedTotal = 0;
  wasPlayingBeforeSeek = false;
  cb.onreset.forEach( f => f(playing, percent) );
  return [playing, percent];
}

export function seekStart() {
  cancelAnimationFrame(rafID);
  seeking = true;
  wasPlayingBeforeSeek = playing;
  playing = false;
}

export function seekEnd() {
  if (seeking && wasPlayingBeforeSeek) play();
  seeking = false;
}


////////////////////////////////////
// Exported Setters

export function setDuration(newDuration) {
  elapsedTotal = newDuration * (percent / 100); // ensure elapsed MS is consistent with new duration by using most recent percent
  duration = newDuration;
}

export function setLooping(bool) {
  looping = bool;
}

export function setPercent(per) {
  elapsedTotal = duration * (per / 100);
  finished = (per == 100) ? true : false; // need to know this when play is started after duration finished and stopped (ie not looped)
  percent = per;
  cb.onframe.forEach( f => f(percent, elapsedTotal) );
}


////////////////////////////////////
// Exported Getters

export function isPlaying() {
  return playing;
}

export function getPercent() {
  return percent;
}


////////////////////////////////////
// Main playing loop

// Keep FPS stable at higher screen refresh rates
const fps = 60;
const interval = Math.floor(1000 / fps); // rounding down since our code will rarely run at the exact interval

// Time tracking
let prevFrame;
let elapsedLoop = 0; // only since loop was last started
let elapsedTotal = 0; // cumulative total MS run


function loop(timestamp) {

  if (!playing) return;

  rafID = requestAnimationFrame(loop);
  const deltaTime = timestamp - prevFrame;
  if (deltaTime < interval) return; // do nothing and exit if this interval was too short (ie don't go too fast)

  // Every frame (that is long enough)
  prevFrame = timestamp - (deltaTime % interval); // Thanks https://www.kirupa.com/animations/ensuring_consistent_animation_speeds.htm
  elapsedLoop += deltaTime;
  elapsedTotal += deltaTime;
  percent = (elapsedTotal / duration) * 100; // don't round to avoid jumpy animation
  if (percent > 100) percent = 100;
  cb.onframe.forEach( f => f(percent, elapsedTotal) );

  // When completed
  if (elapsedTotal >= duration) {

    if (looping) { // loop
      cb.onloop.forEach( f => f(elapsedTotal) );
      elapsedTotal = 0;

    } else { // finish
      cb.onfinish.forEach( f => f(elapsedTotal) );
      elapsedTotal = duration;
      playing = false;
      finished = true; // needed for when duration is changed after finished and stopped (is not looped)
    }
  }
}
