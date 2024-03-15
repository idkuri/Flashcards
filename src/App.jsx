import { useState } from 'react'
import './App.css'
import chinese_vocabulary from "./chinese.json"
import Fuse from 'fuse.js'


function App() {
  const [flipped, setFlipped] = useState(false)
  const [index, setIndex] = useState(Math.floor(Math.random() * chinese_vocabulary.length))
  const [card, setCard] = useState(chinese_vocabulary[Math.floor(Math.random() * chinese_vocabulary.length)])
  const [cardSet, setCardSet] = useState(chinese_vocabulary)
  const [inputValue, setInputValue] = useState("")
  const [glow, setGlow] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [streak, setStreak] = useState(0)
  const [cardsMastered, setMastered] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [numCard, setNumCard] = useState(chinese_vocabulary.length)

  const [countDown, setCountDown] = useState(null);

  const options = {
    includeScore: true,
    threshold: 0.3,
    keys: ["definition"]
  }
  const fuse = new Fuse([card], options)

  function handleCardShuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    setCardSet(array)
    setCard(cardSet[index])
    setFlipped(false)
  }

  function nextCard() {
    let curr = index
    if (curr + 1 >= cardSet.length) {
      curr = 0
    }
    else {
      curr = curr + 1
    }
    setIndex(curr)
    setCard(cardSet[curr])
    setGlow(0)
    setFlipped(false)
  }

  function prevCard() {
    let curr = index
    if (curr - 1 < 0) {
      curr = cardSet.length-1
    }
    else {
      curr = curr - 1
    }
    setIndex(curr)
    setCard(cardSet[curr])
    setGlow(0)
    setFlipped(false)
    
  }

  function checkAnswer() {
    const searchPattern = inputValue
    const result = fuse.search(searchPattern)
    const fzymatch = (result.length === 1)
    if (inputValue === card.definition || fzymatch) {
      setFlipped(true)
      setGlow(1)
      setStreak(streak + 1)
      if (streak >= longestStreak) {
        setLongestStreak(streak + 1)
      }
    }
    else {
      setFlipped(true)
      setStreak(0)
      setGlow(2)
    }
    if (countDown !== null) {
      clearInterval(countDown);
    }

    setInputValue("")

    const newCountDown = setInterval(() => {
      setGlow(0)
      setFlipped(false)
      clearInterval(newCountDown)
    }, 2000)

    setCountDown(newCountDown)
  }


  function handleMasteredButton(e) {
    e.stopPropagation();
    setMastered([...cardsMastered, card])
    let newCardSet = [...cardSet]
    newCardSet = newCardSet.filter(item => item.id !== card.id)
    setNumCard(numCard - 1)
    if (newCardSet.length > 0) {
      const newIndex = Math.floor(Math.random() * newCardSet.length);
      const newCard = newCardSet[newIndex]
      setCardSet(newCardSet)
      setIndex(newIndex)
      setCard(newCard)
      if (flipped) {
        setFlipped(false)
      }
    }
  }
  

  function renderFlashcard() {
    if (numCard === 0) {
      return (
        <div className={'Flashcard' + card.difficulty + (flipped ? " flipped": "")} onClick={() => {setFlipped(!flipped)}}>
          <h1>{"You mastered everything!"}</h1>
        </div>
      )
    }
    if (flipped) {
      return(
        <div className={'Flashcard' + card.difficulty + (flipped ? " flipped": "")} onClick={() => {setFlipped(!flipped)}}>
          <h1>{card.definition}</h1>
          <h1>{card.pronunciation}</h1>
          <img className="image" src={card.img}></img>
          <button className={"masteredButton " + (flipped ? "flipped" : "") } onClick={(e) => {handleMasteredButton(e)}}>Mastered</button>
        </div>
      )
    }
    else {
      return (
        <div className={'Flashcard' + card.difficulty + (flipped ? " flipped": "")} onClick={() => {setFlipped(!flipped)}}>
          <h1>{card.word}</h1>
          <h1>{card.difficulty}</h1>
        </div>
      )
    }
  }

  function renderFeedback() {
    if (glow === 1) {
      return (
        <div className='correctOverlay'>
          <img className="feedbackCorrect" src="./correct.png"></img>
        </div>
      )
    }
    else if (glow == 2) {
      return (
        <div className='incorrectOverlay'>
          <img className="feedbackIncorrect" src="./incorrect.png"></img>
        </div>
      )
    }
    else {
      return null;
    }
  }

  function renderSideBarButton() {
    if (!isSidebarOpen) {
      return (
        <button className={'sideBarButton ' + (isSidebarOpen? "sidebar-open" : "")} onClick={() => {setIsSidebarOpen(!isSidebarOpen)}}>{"<"}</button>
      )
    }
    else {
      return(
        <button className={'sideBarButton ' + (isSidebarOpen? "sidebar-open" : "")} onClick={() => {setIsSidebarOpen(!isSidebarOpen)}}>{">"}</button>
      )
      
    }
  }

  return (
    <>
    <div className={'masteredCards ' + (isSidebarOpen ? "sidebar-open" : "")}>
      <h1>Mastered Words</h1>
      {cardsMastered.map((i) => (
        <p key={i.id}>{i.word}</p>
      ))}
    </div>
    <div className={'App ' + (isSidebarOpen? "sidebar-open" : "")}>
      {renderSideBarButton()}
      <div className='container'>
        {renderFeedback()}
        <h1 className='app-header'>Chinese Flash Cards</h1>
        <p>Learning Chinese just became fun!</p>
        <p>Number of Flashcards: {numCard}</p>
        <p>Longest Streak: {longestStreak}</p>
        <p>Current Streak: {streak}</p>
        {renderFlashcard()}
        <div className='answerSection'> 
          <input className="answerInput" type="text" placeholder="Enter Answer" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") {checkAnswer(); setInputValue("")}}}/>
          <button className='submitButton' onClick={() => {checkAnswer()}}>Submit Answer</button>
        </div>
        <div className='footer'>
          <button className='nextButton' onClick={() =>{prevCard()}}>{"<"}</button>
          <button className='nextButton' onClick={() =>{nextCard()}}>{">"}</button>
          <button className='shuffleButton' onClick={() =>{handleCardShuffle(cardSet)}}>{"Shuffle Cards"}</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
