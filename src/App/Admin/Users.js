import { Layout, message } from "antd";
import { Redirect } from "react-router";

function Users(props) {
    if (props.user.status !== 1) {
        return <Redirect to="/403" />
    }
    return (
        <Layout>

        </Layout>

    )
}

export default Users;
