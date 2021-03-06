import React, { Component } from "react";
import axios from "axios";
import { Button, Form, Table, Label, Input } from "reactstrap";

class Movie extends Component {
    constructor(props) {
        super(props);

        this.state = {
            movies: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getMovies(0);
    }
    delay = (ms) => new Promise((res) => setTimeout(res, ms));

    getMovies = async (a) => {
        if (a) {
            await this.delay(50);
        }

        axios.get("/api/movie").then((res) => {
            this.setState({ movies: res.data });
        });
    };

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        if (data.get("movieName")) {
            // console.log(data.get("movieName"));
            // console.log(data.get("seen"));
            axios
                .post("/api/movie/add", {
                    movieName: data.get("movieName"),
                    seen: data.get("seen"),
                })
                .then(this.getMovies(1));
        }
    }

    render() {
        let tableBody = null;
        if (this.state.movies.length > 0) {
            tableBody = this.state.movies.map((movie, index) => (
                <tr key={index}>
                    <th scope="row">{movie.movieName}</th>
                    <th>{movie.seen ? "yes" : "no"}</th>
                </tr>
            ));
        }

        return (
            <div>
                <Form
                    inline
                    onSubmit={this.handleSubmit}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {" "}
                    <Label for="exampleEmail" className="mr-sm-2">
                        Movie
                    </Label>
                    <Input
                        id="movieName"
                        name="movieName"
                        placeholder="Lord of the Rings"
                        type="text"
                    />{" "}
                    <Label check>
                        <Input id="seen" name="seen" type="checkbox" /> Seen?
                    </Label>
                    <Button>Submit</Button>
                </Form>
                <br />
                <Table>
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Seen?</th>
                        </tr>
                    </thead>
                    <tbody>{tableBody}</tbody>
                </Table>
            </div>
        );
    }
}

export default Movie;
