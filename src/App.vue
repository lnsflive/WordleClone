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
  availableWords: ["Aargh","Aback","Abaft","About","Above","Abuse","Accel","Acute","Adieu","Adios","Admit","Adopt","Adown","Adult","Afoot","Afore","Afoul","After","Again","Agape","Agent","Agree","Ahead","Ahull","Alack","Alcon","Alife","Alike","Aline","Alive","Allow","Aloft","Aloha","Alone","Along","Aloof","Aloud","Alter","Amiss","Among","Amply","Amuck","Anger","Angry","Apace","Apart","Apple","Apply","Aptly","Arear","Argue","Arise","Aside","Askew","Aught","Avast","Avoid","Award","Aware","Awful","Badly","Bakaw","Bally","Basic","Basis","Beach","Begin","Below","Birth","Black","Blame","Bless","Blige","Blind","Block","Blood","Board","Bothe","Brain","Brava","Brave","Bravo","Bread","Break","Brief","Bring","Broad","Brown","Build","Burst","Buyer","Canny","Carry","Catch","Cause","Chain","Chair","Cheap","Check","Chest","Chief","Child","China","Chook","Circa","Civil","Claim","Class","Clean","Clear","Climb","Clock","Close","Coach","Coast","Count","Court","Cover","Coyly","Crazy","Cream","Crime","Cross","Crowd","Crown","Cycle","Daily","Damme","Dance","Death","Depth","Dildo","Dimly","Dirty","Ditto","Doubt","Draft","Drama","Dream","Dress","Drily","Drink","Drive","Dryly","Dully","Early","Earth","Empty","Enemy","Enjoy","Enter","Entry","Equal","Error","Event","Exact","Exist","Extra","Faint","Faith","False","Fatly","Fault","Feyly","Field","Fifth","Fight","Final","First","Fitly","Floor","Focus","Force","Forte","Forth","Frame","Frank","Fresh","Frick","Front","Fruit","Fudge","Fully","Funny","Furth","Gaily","Gayly","Giant","Glass","Godly","Golly","Grand","Grant","Grass","Gratz","Great","Green","Gross","Group","Guess","Guide","Hallo","Haply","Happy","Harsh","Hasta","Havoc","Heart","Heavy","Hella","Hello","Hence","Henry","Horse","Hotel","Hotly","House","Howay","Howdy","Hullo","Human","Huzza","Icily","Ideal","Image","Imply","Index","Infra","Inner","Input","Issue","Japan","Jesus","Jildi","Joint","Jolly","Jones","Judge","Knife","Large","Laugh","Laura","Laxly","Layer","Learn","Leave","Legal","Lento","Level","Lewis","Light","Limit","Local","Loose","Lordy","Lowly","Lucky","Lunch","Madly","Magic","Major","March","Marry","Match","Maybe","Mercy","Metal","Minor","Minus","Model","Money","Month","Moral","Motor","Mouth","Music","Naked","Nasty","Naval","Neath","Never","Newly","Night","Nobly","Noise","North","Novel","Nurse","Occur","Oddly","Offer","Often","One’s","Order","Other","Ought","Outer","Owner","Panel","Paper","Party","Peace","Peter","Phase","Phone","Piano","Piece","Pilot","Pitch","Place","Plain","Plane","Plant","Plate","Plonk","Plumb","Point","Pound","Power","Press","Price","Pride","Prime","Prior","Prize","Proof","Proud","Prove","Psych","Queen","Queer","Quick","Quiet","Quite","Radio","Raise","Ramen","Range","Rapid","Ratio","Reach","Ready","Redly","Refer","Relax","Reply","Right","River","Roman","Rough","Round","Route","Royal","Rugby","Rural","Sadly","Salve","Scale","Scene","Scope","Score","Sense","Serve","Shall","Shape","Share","Sharp","Sheep","Sheer","Sheet","Shift","Shily","Shirt","Shock","Shoot","Short","Shyly","Sight","Silly","Simon","Since","Sixth","Skill","Slash","Sleek","Sleep","Slyly","Small","Smart","Smile","Smith","Smoke","Sniff","So-So","Solid","Solve","Sorry","Sound","South","Space","Spang","Spare","Speak","Speed","Spend","Spite","Split","Sport","Squad","Staff","Stage","Stand","Stark","Start","State","Steam","Steel","Steep","Stick","Still","Stock","Stone","Store","Study","Stuff","Style","Sugar","Super","Sweet","Table","Tally","Taste","Teach","Terry","Thame","Thank","Theme","There","Thiam","Thick","Thine","Thing","Think","Third","Throw","Thwap","Tight","Title","Today","Total","Touch","Tough","Tower","Track","Trade","Train","Treat","Trend","Trial","Truly","Trust","Truth","Twice","Uncle","Under","Union","Unity","Until","Upper","Upset","Urban","Usual","Utter","Vague","Valid","Value","Video","Viola","Visit","Vital","Voice","Wacko","Wanly","Waste","Watch","Water","Wetly","Where","Which","While","Whist","White","Whole","Whose","Whoso","Wilma","Wirra","Woman","Woops","World","Worry","Would","Wowie","Write","Wrong","Yecch","Yeeha","Yeesh","Young","Yours","Youth","Yowch","Zowie"],
  currentGuessIndex: 0,
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
  } else if (key == "{bksp}"){
    state.guesses[state.currentGuessIndex] = 
      currentGuess.slice(0,-1)
    tick.play()
  } else if(currentGuess.length < 5){
    const alphaRegex = /[a-zA-Z]/
    if(alphaRegex.test(key)){
      state.guesses[state.currentGuessIndex] += key
      tick.play()
    }
  }
}

onMounted(() => {
  window.addEventListener("keyup", (e) => {
    e.preventDefault()
    let key =
      e.key == "Enter"
        ? "{enter}"
        : e.key == "Backspace"
        ? "{bksp}"
        : e.key
    handleInput(key)
  })
  state.solution = state.availableWords[Math.floor(Math.random() * state.availableWords.length)].toLowerCase()
  //console.log(state.solution)
})
</script>

<template>
  <div class="flex flex-col h-screen max-w-md mx-auto justify-evenly">
    <div class="text-center">
      <button
        class="bg-green-600 text-white rounded px-8 py-3 font-bold"
        @click="refreshPage()"
      >
        Play Again?
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
    <div class="text-center">
      <p v-if="wonGame">
        🏆 Congrats you solved it!
      </p>
      <p v-else-if="lostGame">
      😔 Out of tries. Word was "{{state.solution}}"
      </p>
    </div>
    <simple-keyboard
      @onKeyPress="handleInput"
      :guessedLetters="state.guessedLetters"
    />
  </div>
</template>

<style>

</style>
