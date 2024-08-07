import React, { useState } from 'react'
import styled from 'styled-components'

const FormField = styled.div`
  width: 100%;
`

const FormLabel = styled.label`
  color: var(--theme-color);
  font-size: 18px;
`

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: black;
  color: ${(props) => (props.isDefault ? '#888' : '#fff')};
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;

  &:focus {
    outline: 2px solid var(--theme-color);
  }
`

const CertificationsContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;
`

export const Certifications = ({
  certifications,
  handleCertificationChange,
}) => {
  const [colors, setColors] = useState({
    p: certifications.p === '',
    h: certifications.h === '',
    s: certifications.s === '',
    t: certifications.t === '',
  })

  const handleChange = (e, category) => {
    handleCertificationChange(e, category)
    setColors({ ...colors, [category]: e.target.value === '' })
  }

  return (
    <CertificationsContainer>
      <FormField>
        <FormLabel htmlFor="pCertification">Certifications</FormLabel>
        <Dropdown
          id="pCertification"
          name="p"
          value={certifications.p}
          onChange={(e) => handleChange(e, 'p')}
          isDefault={colors.p}
        >
          <option value="">Paragliding certification</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
          <option value="P4">P4</option>
          <option value="P5">P5</option>
        </Dropdown>
      </FormField>
      <FormField>
        <Dropdown
          id="hCertification"
          name="h"
          value={certifications.h}
          onChange={(e) => handleChange(e, 'h')}
          isDefault={colors.h}
        >
          <option value="">Hang gliding certification</option>
          <option value="H1">H1</option>
          <option value="H2">H2</option>
          <option value="H3">H3</option>
          <option value="H4">H4</option>
          <option value="H5">H5</option>
        </Dropdown>
      </FormField>
      <FormField>
        <Dropdown
          id="sCertification"
          name="s"
          value={certifications.s}
          onChange={(e) => handleChange(e, 's')}
          isDefault={colors.s}
        >
          <option value="">Speed flying certification</option>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
          <option value="S3">S3</option>
          <option value="S4">S4</option>
        </Dropdown>
      </FormField>
      <FormField>
        <Dropdown
          id="tCertification"
          name="t"
          value={certifications.t}
          onChange={(e) => handleChange(e, 't')}
          isDefault={colors.t}
        >
          <option value="">Tandem certification</option>
          <option value="T1">T1</option>
          <option value="T3">T3</option>
        </Dropdown>
      </FormField>
    </CertificationsContainer>
  )
}
