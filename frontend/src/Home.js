import React, { Component, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  Text,
  Grid
} from 'grommet';
const theme = {
  global: {
    colors: {
      brand: '#1b517b',
      focus: "#1b517b",
      active: "#1b517b",
    },
    font: {
      family: 'Lato',
    },
  },
};

const SidebarButton = ({ label, ...rest }) => (
  <Button plain {...rest}>
    {({ hover }) => (
      <Box
        background={hover ? "#DADADA" : undefined}
        pad={{ horizontal: "large", vertical: "medium" }}
      >
        <Text size="large" color="#ededeb" weight="bold">{label}</Text>
      </Box>
    )}
  </Button>
);

const SidebarButtons = () => {
  const [active, setActive] = useState();
  return (
    <Grommet full theme={theme}>
      <Box fill direction="row">
        <Box background="brand">
          {["Medical Record", "Appointments", "Book Appointment", "Sign Out"].map(label => (
            <SidebarButton
              key={label}
              label={label}
              active={label === active}
              onClick={() => {
                if (label === "Book Appointment") {
                  window.location = "/scheduleAppt"
                }
                else if (label === "Sign Out") {
                  fetch("http://localhost:3001/endSession");
                  window.location = "/"
                }
                else if (label === "Appointments") {
                  window.location = "/PatientsViewAppt"
                }
                else if (label === "Medical Record") {
                  let email_in_use = "";
                  fetch("http://localhost:3001/userInSession")
                    .then(res => res.json())
                    .then(res => {
                      var string_json = JSON.stringify(res);
                      var email_json = JSON.parse(string_json);
                      email_in_use = email_json.email;
                      console.log("Email In Use Is :" + email_in_use);
                      window.location = "/ViewOneHistory/" + email_in_use;
                    });
                }
                setActive(label);
              }}
            />
          ))}
        </Box>
      </Box>
    </Grommet>
  );
};
export class Home extends Component {
  renderName = ({ name, email }) => <div key={email}>{name} {name}</div>

  render() {
    const Header = () => (
      <Box
        tag='header'
        background='brand'
        pad='small'
        elevation='small'
        justify='between'
        direction='row'
        align='center'
        flex={false}
        style={{borderBottom:"1px solid grey"}}
      >
        <a style={{ color: '#ededeb', textDecoration:"none"}} href="/"><Heading level='4' margin='none'>GROUP 07 - Hospital Data Management</Heading></a>
      </Box>
    );

    return (
      <Grommet full={true}
        theme={theme} >
        <Box fill={true}>
          <Header/>
          <Grid
            fill
            rows={['auto', 'flex']}
            columns={['auto', 'flex']}
            areas={[
              { name: 'sidebar', start: [0, 1], end: [0, 1] },
              { name: 'main', start: [1, 1], end: [1, 1] },
            ]}>
            <Box
              gridArea="sidebar"
              width="small"
              animation={[
                { type: 'fadeIn', duration: 300 },
                { type: 'slideRight', size: 'xlarge', duration: 150 },
              ]}
            >
              <SidebarButtons />
            </Box>
            <Box
              gridArea="main"
              justify="top"
              align="center">
              <Box align="center" pad="large">
                <Heading 
                  color="#0f3b75">Welcome Patient
                </Heading>
              </Box>
            </Box>
          </Grid>
        </Box>
      </Grommet>
    );
  }
}

export default Home;