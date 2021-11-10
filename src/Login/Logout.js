import axios from "axios";
import { Result, Spin, Button } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Route } from "react-router";

import "./Logout.scss";

// Component for logout successfully
export default function Logout(props) {
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        axios.get("/api/logout").then((res) => {
            if (res.status === 200) {
                setSuccess(true);
            }
        });
    }, []);
    return (
        <div id="logoutContainer">
            {success ? (
                <Result
                    status="success"
                    title="You have been successfully logged out!"
                    extra={[
                        <Button type="primary" key="console">
                            <Route>
                                <Link to="/login">Return</Link>
                            </Route>
                        </Button>,
                    ]}
                />
            ) : (
                <Spin size="large" />
            )}
        </div>
    );
}
