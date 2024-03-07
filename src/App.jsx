import { useState } from 'react'
import './App.css'
import chinese_vocabulary from "./chinese.json"

function App() {
  const [flipped, setFlipped] = useState(false)
  const [card, setCard] = useState(chinese_vocabulary[0])

  function handleCardSwap() {
    let index = Math.floor(Math.random() * chinese_vocabulary.length)
    while (card.id === index) {
      index = Math.floor(Math.random() * chinese_vocabulary.length)
    }
    setFlipped(false)
    setCard(chinese_vocabulary[index])
  }

  return (
    <>
    <div className='App'>
      <div className='container'>
        <h1 className='app-header'>Chinese Flash Cards</h1>
        <p>Learning Chinese just became fun!</p>
        <p>Number of Flashcards: {chinese_vocabulary.length - 1}</p>
        <div className={'Flashcard' + card.difficulty + (flipped ? " flipped": "")} onClick={() => {setFlipped(!flipped)}}>
          {flipped ? (
            <>
              <h1>{card.definition}</h1>
              <h1>{card.pronunciation}</h1>
              <img className="image" src={card.img}></img>
            </>

          ) : (
          <>
          <h1>{card.word}</h1>
          <h1>{card.difficulty}</h1>
          </>)}
        </div>
        <button className='nextButton' onClick={() =>{handleCardSwap()}}>{">"}</button>
      </div>
    </div>
    </>
  )
}

export default App
