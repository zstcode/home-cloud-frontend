import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

// The breadcrumb in the header to show the current path
function NavigateBreadcrumb(props) {
    let items = [];
    if (props.path !== "/") {
        const paths = props.path.split("/").filter((v) => v.length > 0);
        if (paths.length > 0) {
            items = [["", "Home"]];
            for (let i = 0; i < paths.length; i++) {
                items.push([
                    items[items.length - 1][0] + "/" + paths[i],
                    paths[i],
                ]);
            }
            items[0][0] = "/";
        }
    }
    return (
        <Breadcrumb id="navigateBreadcrumb">
            {items.map((v) => (
                <Breadcrumb.Item>
                    <Link to={"/files" + v[0]}>{v[1]}</Link>
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
}

export default NavigateBreadcrumb;
