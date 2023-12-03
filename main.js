const prevButton = document.getElementById("prev")

const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton = document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')


//index sarki icin
let index

//dongu
let loop = true

//karistirici acik mi?
let isShuffleActive = false

//Sarki listesi
const songsList = [
    {
        name: "Günü Gelir",
        link: "assets/günügelir.mp3",
        artist: "Dedubliman",
        image: "assets/dedubliman.jpg"
    },
    {
        name: "Love The Way You Love",
        link: "assets/eminem.mp3",
        artist: "Eminem-Rihanna",
        image: "assets/eminem.jpg"
    },
    {
        name: "Good Part",
        link: "assets/goodpart.mp3",
        artist: "AJR",
        image: "assets/ajr.jpg"
    },
    {
        name: "Can Dostum",
        link: "assets/candostum.mp3",
        artist: "Emir Can İğrek",
        image: "assets/candostum.jpg"
    },


    {
        name: "Ateşe Düştüm",
        link: "assets/atesedüstüm.mp3",
        artist: "Mert Demir",
        image: "assets/atesedüstüm.jpg"
    },

    {
        name: "Nothing Else Matters",
        link: "assets/metalica.mp3",
        artist: "Metallica",
        image: "assets/metalica.jpg"
    },

    {
        name: "İn This Skirt",
        link: "assets/inthis.mp3",
        artist: "İrrepressibles",
        image: "assets/inthis.jpg"
    }
]

//zaman formati ayarlama
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" + second : second
    return `${minute}:${second}`
}



//sarkiyi calma
const playAudio = () => {
    console.log("playAudio")
    audio.play()
    pauseButton.classList.remove("hide")
    playButton.classList.add("hide")
}

//sarki atama
const setSong = (arrayIndex) => {
    if (loop == true && isShuffleActive == true) {
        arrayIndex = Math.floor(Math.random()*100)%5
    }
    console.log(arrayIndex  + isShuffleActive)

    let { name, link, artist, image } = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

    audio.onloadedmetadata = () => {

        maxDuration.innerText = timeFormatter(audio.duration)
    }
    playListContainer.classList.add("hide")
    playAudio()
}


//siradakini cal
const nextSong = () => {
    if (loop) {
        if (index == (songsList.length - 1)) {
            index = 0
        } else {
            index += 1
        }
        setSong(index)
    } else {
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }
}

playListButton.addEventListener('click', () => {
    playListContainer.classList.remove('hide')
})

closeButton.addEventListener('click', () => {
    playListContainer.classList.add('hide')
})

const pauseAudio = () => {
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
    //
}, 1000);

progressBar.addEventListener("click", (event) => {
    let coordStart = progressBar.getBoundingClientRect().left

    let coordEnd = event.clientX
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth

    currentProgress.style.width = progressBar * 100 + "%"

    audio.currentTime = progress * audio.duration
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

const previousSong = () => {
    console.log(index)
    if (index > 0) {
        index -= 1
    } else {
        index = songsList.length - 1 //4
    }
    setSong(index)

}

repeatButton.addEventListener('click', () => {
    if (repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active')
        audio.loop = false
        console.log('tekrar kapatildi')
    } else {
        repeatButton.classList.add('active')
        audio.loop = true
        console.log('tekrar acildi')
    }
})

shuffleButton.addEventListener('click', () => {
    if (shuffleButton.classList.contains('active')) {
        isShuffleActive = false
        shuffleButton.classList.remove('active')
        audio.loop = true
        console.log('karistirici kapatildi')
    } else {
        isShuffleActive = true
        shuffleButton.classList.add('active')
        audio.loop = false
        console.log('karistirici acildi')
    }
})

const initializePlaylist = () => {
    for (let i in songsList) {
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container"> 
          <img src="${songsList[i].image}" width=100%/>
        </div>
        <div class="playlist-song-details">
          <span id="playlist-song-name">
            ${songsList[i].name}
          </span>
          <span id="playlist-song-artist-album">
            ${songsList[i].artist}
          </span>
        </div>
        </li>`
    }
}

//Tiklama Yakalama
nextButton.addEventListener('click', nextSong)
pauseButton.addEventListener('click', pauseAudio)
playButton.addEventListener('click', playAudio)
prevButton.addEventListener('click', previousSong)



//sarki bitisini yakala
audio.onended = () => {
    nextSong()
}

audio.addEventListener('timeupdate', () => {
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})

//ekran yuklenildiginde
window.onload = () => {
    index = 0
    setSong(index)
    //durdur ve sarki listesi olustur

    pauseAudio()
    initializePlaylist()
}
