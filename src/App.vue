<script setup>
import SimpleKeyboard from './components/SimpleKeyboard.vue';
import { reactive, onMounted, computed} from 'vue'
import WordRow from './components/WordRow.vue';
import TickSoundSrc from './assets/tick.mp3'
import SpinSoundSrc from './assets/spin.mp3'
import WinSoundSrc from './assets/win.mp3'
import LoseSoundSrc from './assets/lose.mp3'

let tick = new Audio(TickSoundSrc)
let spin = new Audio(SpinSoundSrc)
let win = new Audio(WinSoundSrc)
let lose = new Audio(LoseSoundSrc)

const state = reactive({
  solution: "",
  guesses: ["","","","","",""],
  availableWords: ["aargh", "aback", "abaft", "about", "above", "abuse", "accel", "actor", "acute", "adieu", "adios", "admit", "adopt", "adown", "adult", "afoot", "afore", "afoul", "after", "again", "agape", "agent", "agree", "ahead", "ahull", "alack", "alarm", "album", "alcon", "alert", "alife", "alike", "aline", "alive", "allow", "aloft", "aloha", "alone", "along", "aloof", "aloud", "alter", "amiss", "among", "amply", "amuck", "anger", "Angle", "angry", "apace", "apart", "apple", "apply", "aptly", "arear", "arena", "argue", "arise", "array", "aside", "askew", "asset", "audio", "audit", "aught", "avast", "avoid", "award", "aware", "awful", "badly", "bakaw", "baker", "bally", "bases", "basic", "basis", "beach", "began", "begin", "begun", "being", "below", "bench", "billy", "birth", "black", "blame", "bless", "blige", "blind", "block", "blood", "board", "boost", "booth", "bothe", "bound", "brain", "brand", "brava", "brave", "bravo", "bread", "break", "breed", "brief", "bring", "broad", "broke", "brown", "build", "built", "burst", "buyer", "cable", "calif", "canny", "carry", "catch", "cause", "chain", "chair", "chart", "chase", "cheap", "check", "chest", "chief", "child", "china", "chook", "chose", "circa", "civil", "claim", "class", "clean", "clear", "click", "climb", "clock", "close", "coach", "coast", "could", "count", "court", "cover", "coyly", "craft", "crash", "crazy", "cream", "crime", "cross", "crowd", "crown", "curve", "cycle", "daily", "damme", "dance", "dated", "dealt", "death", "debut", "delay", "depth", "dildo", "dimly", "dirty", "ditto", "doing", "doubt", "dozen", "draft", "drama", "drawn", "dream", "dress", "drill", "drily", "drink", "drive", "drove", "dryly", "dully", "dying", "eager", "early", "earth", "eight", "elite", "empty", "enemy", "enjoy", "enter", "entry", "equal", "error", "event", "every", "exact", "exist", "extra", "faint", "faith", "false", "fatly", "fault", "feyly", "fiber", "field", "fifth", "fifty", "fight", "final", "first", "fitly", "fixed", "flash", "fleet", "floor", "fluid", "focus", "force", "forte", "forth", "forty", "forum", "found", "frame", "frank", "fraud", "fresh", "frick", "front", "fruit", "fudge", "fully", "funky", "funny", "furth", "gaily", "gayly", "giant", "given", "glass", "globe", "godly", "going", "golly", "grace", "grade", "grand", "grant", "grass", "gratz", "great", "green", "gross", "group", "grown", "guard", "guess", "guest", "guide", "hallo", "haply", "happy", "harry", "harsh", "hasta", "havoc", "heart", "heavy", "hella", "hello", "hence", "henry", "horse", "hotel", "hotly", "house", "howay", "howdy", "hullo", "human", "huzza", "icily", "ideal", "image", "imply", "index", "infra", "inner", "input", "issue", "japan", "jesus", "jildi", "jimmy", "joint", "jolly", "jones", "judge", "knife", "known", "label", "large", "laser", "later", "laugh", "laura", "laxly", "layer", "learn", "lease", "least", "leave", "legal", "lento", "level", "lewis", "light", "limit", "links", "lives", "local", "logic", "loose", "lordy", "lower", "lowly", "lucky", "lunch", "lying", "madly", "magic", "major", "maker", "march", "maria", "marry", "match", "maybe", "mayor", "meant", "media", "mercy", "metal", "might", "minor", "minus", "mixed", "model", "money", "month", "moral", "motor", "mount", "mouse", "mouth", "movie", "music", "naked", "nasty", "naval", "neath", "needs", "never", "newly", "night", "nobly", "noise", "north", "noted", "novel", "nurse", "occur", "ocean", "oddly", "offer", "often", "one’s", "order", "other", "ought", "outer", "owner", "paint", "panel", "paper", "party", "peace", "peter", "phase", "phone", "photo", "piano", "piece", "pilot", "pitch", "place", "plain", "plane", "plant", "plate", "plonk", "plumb", "point", "pound", "power", "press", "price", "pride", "prime", "print", "prior", "prize", "proof", "proud", "prove", "psych", "queen", "queer", "quick", "quiet", "quite", "radio", "raise", "ramen", "range", "rapid", "ratio", "reach", "ready", "redly", "refer", "relax", "reply", "right", "rival", "river", "robin", "roger", "roman", "rough", "round", "route", "royal", "rugby", "rural", "sadly", "salve", "scale", "scene", "scope", "score", "sense", "serve", "seven", "shall", "shape", "share", "sharp", "sheep", "sheer", "sheet", "shelf", "shell", "shift", "shily", "shirt", "shock", "shoot", "short", "shown", "shyly", "sight", "silly", "simon", "since", "sixth", "sixty", "sized", "skill", "slash", "sleek", "sleep", "slide", "slyly", "small", "smart", "smile", "smith", "smoke", "sniff", "so-so", "solid", "solve", "sorry", "sound", "south", "space", "spang", "spare", "speak", "speed", "spend", "spent", "spite", "split", "spoke", "sport", "squad", "staff", "stage", "stake", "stand", "stark", "start", "state", "steam", "steel", "steep", "stick", "still", "stock", "stone", "stood", "store", "storm", "story", "strip", "stuck", "study", "stuff", "style", "sugar", "suite", "super", "sweet", "table", "taken", "tally", "taste", "taxes", "teach", "teeth", "terry", "texas", "thame", "thank", "theft", "their", "theme", "there", "these", "thiam", "thick", "thine", "thing", "think", "third", "those", "three", "threw", "throw", "thwap", "tight", "times", "tired", "title", "today", "topic", "total", "touch", "tough", "tower", "track", "trade", "train", "treat", "trend", "trial", "tried", "tries", "truck", "truly", "trust", "truth", "twice", "uncle", "under", "undue", "union", "unity", "until", "upper", "upset", "urban", "usage", "usual", "utter", "vague", "valid", "value", "video", "viola", "virus", "visit", "vital", "voice", "wacko", "wanly", "waste", "watch", "water", "wetly", "wheel", "where", "which", "while", "whist", "white", "whole", "whose", "whoso", "wilma", "wirra", "woman", "women", "woops", "world", "worry", "worse", "worst", "worth", "would", "wound", "wowie", "write", "wrong", "wrote", "yecch", "yeeha", "yeesh", "yield", "young", "yours", "youth", "yowch", "zowie"],
  currentGuessIndex: 0,
  hardMode: false,
  error: "",
  guessedLetters: {
    miss: [],
    found: [],
    hint: []
  }
})

const wonGame = computed(
  () => {
    if(state.guesses[state.currentGuessIndex - 1] === state.solution){
      win.play()
      return true
    }
  }
)
const lostGame = computed(() => {
  if(!wonGame.value
  && state.currentGuessIndex >= 6){
    lose.play()
    return true
  }
}
)

const refreshPage = () => {
  window.location.reload();
}

const handleInput = (key) => {
  if (state.currentGuessIndex >= 6 || wonGame.value){
    return;
  }

  const currentGuess = state.guesses[state.currentGuessIndex]

  if(key == "{enter}"){
    if(currentGuess.length == 5){
      if(state.hardMode){
        if(state.availableWords.includes(currentGuess)){
          state.currentGuessIndex++
          for(var i = 0; i < currentGuess.length; i++){
            let c = currentGuess.charAt(i)
            if(c == state.solution.charAt(i)){
              state.guessedLetters.found.push(c)
            } else if(state.solution.indexOf(c) != -1){
              state.guessedLetters.hint.push(c)
            } else{
              state.guessedLetters.miss.push(c)
            }
          } 
          tick.play()
        }else{
          return
        }
      }else{
        state.currentGuessIndex++
        for(var i = 0; i < currentGuess.length; i++){
          let c = currentGuess.charAt(i)
          if(c == state.solution.charAt(i)){
            state.guessedLetters.found.push(c)
          } else if(state.solution.indexOf(c) != -1){
            state.guessedLetters.hint.push(c)
          } else{
            state.guessedLetters.miss.push(c)
          }
        } 
        tick.play()
      }
    }
  } else if (key == "{bksp}"){
    state.guesses[state.currentGuessIndex] = 
      currentGuess.slice(0,-1)
    tick.play()
  } else if(currentGuess.length < 5){
    const alphaRegex = /[a-zA-Z]/
    if(alphaRegex.test(key)){
      state.guesses[state.currentGuessIndex] += key.toLowerCase()
      tick.play()
    }
  }
}

onMounted(() => {
  let excludedKeys = ["Alt", "Shift", "Control", "Escape", "Tab", "CapsLock", "NumLock"]
  window.addEventListener("keyup", (e) => {
    e.preventDefault()
    if(!excludedKeys.includes(e.key)){
      let key =
        e.key == "Enter"
          ? "{enter}"
          : e.key == "Backspace"
          ? "{bksp}"
          : e.key
      handleInput(key)
    }
  })
  state.solution = state.availableWords[Math.floor(Math.random() * state.availableWords.length)].toLowerCase()
  //console.log(state.solution)
})
</script>

<template>
  <div class="bg-white flex flex-col h-screen max-w-md mx-auto justify-evenly">
    <div class="grid grid-cols-2 gap-8 px-16">
      <button
        class="bg-green-600 text-white rounded py-4 font-bold"
        @click="refreshPage()"
      >
        Play Again?
      </button>
      <button
        class="bg-red-500 text-white rounded py-4 font-bold"
        @click="state.hardMode = !state.hardMode"
      >
        Hard Mode: {{state.hardMode ? 'Y' : 'N'}}
      </button>
    </div>
    <div>
      <word-row
        v-for="(guess, i) in state.guesses"
        :key="i"
        :value="guess"
        :solution="state.solution"
        :submitted="i < state.currentGuessIndex"
      />
    </div>
    <div class="text-center rounded mx-16">
      <p v-if="wonGame">
        🏆 Congrats you solved it!
      </p>
      <p v-else-if="lostGame">
      😔 Out of tries. Word was "{{state.solution}}"
      </p>
      <p v-else :class="[state.error ? 'text-black':'text-white']">
        {{state.error ? state.error : '.'}}
      </p>
    </div>
    <simple-keyboard
      @onKeyPress="handleInput"
      :guessedLetters="state.guessedLetters"
    />
  </div>
</template>

<style>
html{
  background-color: black;
}
</style>
