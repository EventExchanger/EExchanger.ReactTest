import * as React from 'react';
import * as H from 'history';
import { match } from "react-router";
import App from './App';
import pageStore from './PageStore';

export interface iPageLoaderProps {
	readonly match: match<{}>;//<Hash<string>>;
	readonly location: H.Location;
	readonly history: H.History;
}
type State = {};

export class PageLoader extends React.Component<iPageLoaderProps, State> {

	async componentDidMount() {
		this.loadPage(this.props.match.url);
	}
	async componentDidUpdate(prevProps: iPageLoaderProps, prevState: State, snapshot: any) {
		this.loadPage(this.props.match.url);
	}/* */

	protected loadPage(path: string) {
		pageStore.load(path);
	}

	render() {
		return <App />;
	}
}
