import React, { Component} from 'react';
import {
    Box,
    Button,
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

export class DocViewAppt extends Component {
    state = { apptlist: [] }

    componentDidMount() {
        this.getNames("");
    }
    getNames(value) {
        let docName = value;
        console.log(docName);
        fetch("http://localhost:3001/userInSession")
            .then(res => res.json())
            .then(res => {
                var string_json = JSON.stringify(res);
                var email_json = JSON.parse(string_json);
                let email_in_use = email_json.email;
                console.log(email_in_use);
                fetch('http://localhost:3001/doctorViewAppt?email=' + email_in_use)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({ apptlist: res.data });
                    });
            });
    }

    render() {
        const { apptlist } = this.state;
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
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Appointment ID</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Patient</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Date</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Start Time</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Symptoms</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apptlist.map(appt =>
                                <tr key={appt.aid}>
                                    <td align="center">{appt.aid}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{appt.name}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{new Date(appt.date).toLocaleDateString().substring(0,10)} </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{appt.starttime}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{appt.symptoms}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{appt.status}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        {appt.status === "NotDone"?
                                            <Button label="Cancel"
                                            onClick = {() => {
                                                fetch('http://localhost:3001/deleteAppt?uid='+ appt.aid)
                                                window.location.reload();
                                            }}
                                            ></Button>
                                        :<div></div>}
                                    </td> 
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        );
        return (
            <Grommet full={true} theme={theme}>
                <Header />
                <Box fill={true}>
                    <Body />
                </Box>
            </Grommet>
        );
    }
}

export default DocViewAppt;