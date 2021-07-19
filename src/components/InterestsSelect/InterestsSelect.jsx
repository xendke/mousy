import React, { Component } from 'react'

import CreatableSelect from 'react-select/creatable'

const components = {
  DropdownIndicator: null,
}

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: 'inset 0 0.0625em 0.125em rgb(10 10 10 / 5%)',
    backgroundColor: '#F8F8FF',
    ...(state.isFocused
      ? {
          borderColor: '#3273dc',
          boxShadow: '0 0 0 0.125em rgb(50 115 220 / 25%)',
        }
      : {}),
  }),
}

const createOption = (label) => ({
  label,
  value: label,
})

const toLabels = (option) => option.label

const isDuplicate = (options, needle) =>
  options.find((opt) => opt.label === needle)

const MAX = 10

export default class InterestsSelect extends Component {
  constructor(props) {
    super(props)
    const { defaultInterests } = this.props
    this.state = {
      inputValue: '',
      value: defaultInterests ? defaultInterests.map(createOption) : [],
    }
  }

  handleChange = (value) => {
    const { getInterests } = this.props
    this.setState({ value })
    getInterests(value.map(toLabels))
  }

  handleInputChange = (inputValue) => {
    this.setState({ inputValue })
  }

  handleKeyDown = (event) => {
    const { inputValue, value } = this.state
    const { getInterests } = this.props
    if (!inputValue) return
    const newValues = [...value, createOption(inputValue)]
    switch (event.key) {
      case 'Enter':
      case 'Tab':
      case ',':
        event.preventDefault()
        if (isDuplicate(value, inputValue)) {
          this.setState({ inputValue: '' })
          break
        }
        if (value.length >= MAX) {
          this.setState({ inputValue: '' })
          break
        }
        this.setState({
          inputValue: '',
          value: newValues,
        })
        getInterests(newValues.map(toLabels))
        break
      default:
        break
    }
  }

  render() {
    const { inputValue, value } = this.state
    const { id: inputId } = this.props
    return (
      <CreatableSelect
        styles={customStyles}
        components={components}
        inputValue={inputValue}
        inputId={inputId}
        isClearable
        isMulti
        formatCreateLabel={(label) => `Add '${label}'`}
        menuIsOpen={inputValue?.length > 0}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        value={value}
        placeholder=""
      />
    )
  }
}
