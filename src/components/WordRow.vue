<script setup>
import LetterBox from './LetterBox.vue';
import {ref, watch} from "vue"
import FoundSoundSrc from '/src/assets/spade.mp3'
import SpinSoundSrc from '/src/assets/spin.mp3'
import TieSoundSrc from '/src/assets/tie.mp3'
import { processSlotOutlet } from '@vue/compiler-core';

const props = defineProps({
    value: String,
    solution: String,
    submitted: Boolean
})

const colors = ref(["","","","","",""])

const playSound = (elem) => {
    let found = new Audio(elem)
    found.load()
    found.play()
}

watch(
    () => props.submitted,
    async (submitted, prevSubmitted) => {
        if(props.submitted){
            let s = props.solution
            let v = props.value

            let temp = ["gray", "gray", "gray", "gray", "gray", "gray"]
            let letterPool = []
            for(let i = 0; i< 5; i++){
                if(s.charAt(i) == v.charAt(i)){
                    temp[i] = "green"
                } else{
                    letterPool.push(s.charAt(i))
                }
            }
            for(let i = 0; i < 5; i++){
                if(temp[i] == "gray"){
                    if(letterPool.indexOf(v.charAt(i)) != -1){
                        letterPool.splice(letterPool.indexOf(v.charAt(i)), 1)
                        temp[i] = "yellow"
                        playSound(TieSoundSrc)
                    }else{
                        playSound(SpinSoundSrc)
                    }
                }else{
                    playSound(FoundSoundSrc)
                }
                colors.value[i] = temp[i]
                await new Promise((resolve) => setTimeout(resolve, 500))
            }
        }
    }
)
</script>

<template>
    <div class="grid max-w-xs grid-cols-5 gap-1 mx-auto mb-1">
        <letter-box
            v-for="i in 5"
            :key="i"
            :letter="value[i-1]"
            :color="colors[i-1]"
        />
    </div>
</template>