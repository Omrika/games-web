import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Card from '../Card'
import Timer from '../Timer'

const Board = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  font-size: 24px;
  font-family: 'Helvetica Neue', 'Helvetica', sans-serif;
  font-weight: 700;
`

const UPDATE_CARD = 'UPDATE_CARD'
const TRACK_TIME = 'TRACK_TIME'
const PLAY_FIRST_CARD = 'PLAY_FIRST_CARD'

export default class BoardWrapper extends PureComponent {
  static propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object),
  }

  state = {
    cards: null,
    isTrackingTime: false,
    playedFirstCard: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cards !== this.props.cards) {
      this.onAction(UPDATE_CARD, { cards: nextProps.cards })
    }
  }

  MAX_ACTIVE_CARDS = 2

  getActiveCards = cards => cards.filter(card => card.isActive)

  getWinningCombo = (symbol, cards) => cards.every(card => card.symbol === symbol)

  isGameOver = cards => cards.every(card => card.isMatched === true)

  onCardClick = card => {
    const { isTrackingTime, playedFirstCard } = this.state

    let cards = this.state.cards.map(
      item => (item.id === card.id ? { ...item, isActive: !item.isActive } : item)
    ) // to toggle cards when we click on them.

    const activeCards = this.getActiveCards(cards)

    const isWinningCombo = activeCards.length > 1 && this.getWinningCombo(card.symbol, activeCards)
    if (isWinningCombo) {
      setTimeout(() => {
        cards = cards.map(item => (item.isActive ? { ...item, isMatched: true } : item))
        this.onAction(UPDATE_CARD, { cards })
        this.isGameOver(cards) && this.onAction(TRACK_TIME, false)
      }, 500)
    }

    const isMaxActiveCards = activeCards.length === this.MAX_ACTIVE_CARDS
    if (isMaxActiveCards) {
      setTimeout(() => {
        cards = this.state.cards.map(item => (item.isActive ? { ...item, isActive: false } : item))
        this.onAction(UPDATE_CARD, { cards })
      }, 500)
    }

    !isTrackingTime ? this.onAction(TRACK_TIME, true) : null
    !playedFirstCard ? this.onAction(PLAY_FIRST_CARD, true) : null

    this.onAction(UPDATE_CARD, { cards })
  }

  onAction = (eventType, payload) => {
    switch (eventType) {
      case UPDATE_CARD: {
        this.setState({ cards: payload.cards })
        break
      }

      case TRACK_TIME: {
        this.setState({ isTrackingTime: payload })
        break
      }

      case PLAY_FIRST_CARD: {
        this.setState({ playedFirstCard: payload })
        break
      }

      default:
        break
    }
  }

  render() {
    const { cards, isTrackingTime, playedFirstCard } = this.state
    return (
      <section>
        <HeaderWrapper>
          {playedFirstCard && !isTrackingTime && <span>Congrats! Your time is:&nbsp;</span>}
          {playedFirstCard ? <Timer isTrackingTime={isTrackingTime} /> : '0:00'}
        </HeaderWrapper>
        <Board>
          {cards &&
            cards.length > 0 &&
            cards.map(card => <Card key={card.id} card={card} onClick={this.onCardClick} />)}
        </Board>
      </section>
    )
  }
}
