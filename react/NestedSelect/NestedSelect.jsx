import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CompositeRow from '../CompositeRow'
import Icon from '../Icon'
import styles from './styles.styl'
import UIRadio from '../Radio'
import cx from 'classnames'
import omit from 'lodash/omit'

/**
 * Select like component to choose an option among a list of options.
 * Options can have children; selecting an option that has children
 * will show the children of the chosen option instead of selecting
 * the option.
 */
class NestedSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [props.options]
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  resetHistory() {
    if (this.unmounted) {
      return
    }
    this.setState({ history: [this.props.options] })
  }

  handleBack = () => {
    const [item, ...newHistory] = this.state.history
    this.setState({
      history: newHistory
    })
    return item
  }

  handleNavToChildren = item => {
    const newHistory = [item, ...this.state.history]
    this.setState({
      history: newHistory
    })
  }

  handleSelect = item => {
    this.props.onSelect(item)
    setTimeout(() => {
      this.resetHistory()
    }, 500)
  }

  handleClickItem = item => {
    if (item.children && item.children.length > 0) {
      this.handleNavToChildren(item)
    } else {
      this.handleSelect(item)
    }
  }

  render() {
    const {
      ContentComponent,
      HeaderComponent,
      canSelectParent,
      isSelected,
      title,
      transformParentItem
    } = this.props
    const { history } = this.state
    const current = history[0]
    const children = current.children || []
    const level = history.length - 1
    const isSelectedWithLevel = item => isSelected(item, level)
    const parentItem = transformParentItem(omit(current, 'children'))

    return (
      <>
        {HeaderComponent ? (
          <HeaderComponent
            title={current.title || title}
            showBack={history.length > 1}
            onClickBack={this.handleBack}
          />
        ) : null}
        <ContentComponent>
          {canSelectParent && level > 0 ? (
            <>
              <ItemRow
                item={parentItem}
                onClick={this.handleClickItem}
                isSelected={isSelectedWithLevel(parentItem)}
              />
              <Divider />
            </>
          ) : null}
          {children.map(item => (
            <ItemRow
              key={item.title}
              item={item}
              onClick={this.handleClickItem}
              isSelected={isSelectedWithLevel(item)}
            />
          ))}
        </ContentComponent>
      </>
    )
  }
}

NestedSelect.defaultProps = {
  ContentComponent: 'div',
  HeaderComponent: null,
  transformParentItem: x => x
}

const ItemPropType = PropTypes.shape({
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(ItemPropType)
})

NestedSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  options: PropTypes.shape({
    children: PropTypes.arrayOf(ItemPropType)
  }),
  canSelectParent: PropTypes.bool
}

export default NestedSelect

export const Radio = ({ className, ...props }) => (
  <UIRadio label="" className={cx(styles.Radio, className)} {...props} />
)

const Divider = () => <div className={styles.Divider} />

export const ItemRow = ({ item, onClick, isSelected }) => {
  return (
    <div className={cx(styles.Row, isSelected ? styles.Row__selected : null)}>
      <CompositeRow
        dense
        image={item.icon}
        primaryText={item.title}
        onClick={() => onClick(item)}
        right={
          item.children && item.children.length > 0 ? (
            <Icon icon="right" color="var(--coolGrey)" />
          ) : (
            <Radio
              readOnly
              name={item.title}
              value={item.title}
              checked={!!isSelected}
            />
          )
        }
      />
    </div>
  )
}
