import styled from 'styled-components'

const FormField = styled.div`
  width: 100%;
  margin-bottom: 10px;
`

const FormLabel = styled.label`
  color: var(--theme-color);
  font-size: 18px;
`

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: black;
  color: #fff;
  // margin-bottom: 16px;
  font-size: 16px;
  font-weight: bold;

  &:focus {
    outline: 2px solid var(--theme-color);
  }
`

const ProfileInput = ({ label, value, onChange, placeholder, style }) => {
  return (
    <FormField style={style}>
      <FormLabel>{label}</FormLabel>
      <FormInput
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </FormField>
  )
}

export default ProfileInput
