import React, { Component} from 'react';
import {
    Box,
    Heading,
    Grommet,
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

export class NoMedHistFound extends Component {
    componentDidMount() {
    }
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
            >
                <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='4' margin='none'>GROUP 07 - Hospital Data Management</Heading></a>

            </Box>
        );
        const Body = () => (
            <div className="container">
                <div className="panel panel-default p50 uth-panel" >
                    <Heading alignSelf="center" textAlign="right" margin="large">Medical History Not Found<br /></Heading>
                </div>
            </div>
        );
        return (
            <Grommet full={true} theme={theme}>
                <Box fill={true}>
                    <Header />
                    <Body />
                </Box>
            </Grommet>
        );
    }
}
export default NoMedHistFound;