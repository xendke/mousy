import React, { Component } from 'react'

import CreatableSelect from 'react-select/creatable'

const components = {
  DropdownIndicator: null,
}

const createOption = (label: string) => ({
  label,
  value: label,
})

const toLabels = (option) => option.label

const isDuplicate = (options, needle) =>
  options.find((opt) => opt.label === needle)

const MAX = 10

export default class InterestsSelect extends Component<*, State> {
  constructor(props) {
    super(props)
    const { defaultInterests } = this.props
    this.state = {
      inputValue: '',
      value: defaultInterests ? defaultInterests.map(createOption) : [],
    }
  }

  handleChange = (value: any) => {
    const { getInterests } = this.props
    this.setState({ value })
    getInterests(value.map(toLabels))
  }

  handleInputChange = (inputValue: string) => {
    this.setState({ inputValue })
  }

  handleKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
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
        components={components}
        inputValue={inputValue}
        inputId={inputId}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        value={value}
        placeholder=""
      />
    )
  }
}
