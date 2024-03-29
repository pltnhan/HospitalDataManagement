import React, { Component} from 'react';

import {
    Box,
    Heading,
    Grommet,
    Table,
    TableBody,
    TableCell,
    TableRow
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

export class ViewOneHistory extends Component {
    state = { medhiststate: [], medhiststate2: []}
    componentDidMount() {
        const { email } = this.props.match.params;
        this.allDiagnoses(email);
        this.getHistory(email);
    }

    getHistory(value) {
        let email = "'" + value + "'";
        fetch('http://localhost:3001/OneHistory?patientEmail='+ email)
        .then(res => res.json())
            .then(res => this.setState({ medhiststate: res.data }));
    }

    allDiagnoses(value) {
        let email = "'" + value + "'";
        fetch('http://localhost:3001/allDiagnoses?patientEmail='+ email)
        .then(res => res.json())
        .then(res => this.setState({ medhiststate2: res.data }));
    }

    render() {
        const { medhiststate } = this.state;
        const { medhiststate2 } = this.state;
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
                <div className="panel panel-default p50 uth-panel">
                    {medhiststate.map(patient =>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell scope="row">
                                        <strong>Name:</strong>
                                    </TableCell>
                                    <TableCell>{patient.p_name}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell><strong>Email:</strong></TableCell>
                                    <TableCell>{patient.p_email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                        <strong>Gender:</strong>
                                    </TableCell>
                                    <TableCell>
                                        {patient.p_biogender}
                                    </TableCell>
                                    <TableCell />
                                    <TableCell>
                                        <strong>Address:</strong>
                                    </TableCell>
                                    <TableCell>{patient.p_province}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                        <strong>Phone Number:</strong>
                                    </TableCell>
                                    <TableCell>
                                        {patient.p_phone}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}
                </div>
                <hr />
            </div>
        );
        const Body2 = () => (
            <div className="container">
                <div className="panel panel-default p50 uth-panel">
                    {medhiststate2.map(patient =>
                        <div>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell scope="row">
                                        <strong>Date:</strong>
                                    </TableCell>
                                    <TableCell>{patient.date.split('T')[0]}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell><strong>Doctor:</strong></TableCell>
                                    <TableCell>{patient.doctor}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                        <strong>Symptoms:</strong>
                                    </TableCell>
                                    <TableCell>{patient.symptom}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                        <strong>Diagnosed Disease:</strong>
                                    </TableCell>
                                    <TableCell>
                                        {patient.disease}
                                    </TableCell>
                                    <TableCell />
                                    <TableCell>
                                        <strong>Treatment:</strong>
                                    </TableCell>
                                    <TableCell>{patient.treatment}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <hr />
                        </div>
                    )}
                </div>
            </div>
        );
        return (
            <Grommet full={true} theme={theme}>
                <Box fill={true}>
                    <Header />
                    <Body />
                    <Body2 />
                </Box>
            </Grommet>
        );
    }
}
export default ViewOneHistory;