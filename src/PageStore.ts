import eexchange from 'eexchange';
export interface iPage {
	content: string;
	error?: string;
}

var page: iPage | undefined = undefined;
var loadingPath: string = ''; // страница которая грузится в данный момент
var loadedPath: string = ''; // страница которая загружена и показывается в данный момент

//const preloadedState = window.__PRELOADED_STATE__;
const _state = typeof window !== 'undefined' ? (window as any).__PRELOADED_STATE__ : undefined;
if (typeof _state !== 'undefined') {
	page = _state.page;
	loadedPath = _state.loadedPath;
}
if (typeof (window as any) !== 'undefined') {
	// Allow the passed state to be garbage-collected
	delete (window as any).__PRELOADED_STATE__;
}/**/

// Tell react-snap how to save Redux state
(window as any).snapSaveState = () => ({
	__PRELOADED_STATE__: { page: page, loadedPath: loadedPath }
});/**/

class PageStore {

	constructor() {
		// слушаем событие о том что кому-то нужен предзагруженный объект страницы (исключительно для SSR)
		eexchange.subscribeEvent(['page-mounted'], (t) => {
			if (page !== undefined) eexchange.raiseEvent({ name: 'page-loaded', initiator: this, data: page });
		});/**/
	}

	load(path: string) {
		const url = (path === '/') ? 'index.json' : path + '.json';

		//console.log('loadPage(path):', path, url);

		// 1 отсекаем если мы уже грузим эту страницу
		if (url === loadingPath) return;

		// 2 отсекаем если эта страница загружена в данный момент и мы не в состояни загрузки
		//console.log('loadPage(path): loadingPath=', loadingPath, ';loadedPath=', loadedPath, ';url=', url);
		if (loadingPath === '' && url === loadedPath) return;


		loadingPath = url;
		fetch(url, {}).then(res => {
			//console.log('data loaded', res);
			if (res.ok) {
				return res.json();
			} else {
				return Promise.reject({ status: res.status, statusText: res.statusText });
			}
		}).then(response => {
			//console.log('data loaded', response);
			page = response;
			loadedPath = url;
			eexchange.raiseEvent({ name: 'page-loaded', initiator: this, data: page });
		}).catch(err => {

			eexchange.raiseEvent({ name: 'page-loaded', initiator: this, data: { content: '', error: JSON.stringify(err.name) } });

			//console.error('load data error', JSON.stringify(err.name));
		}).finally(() => {
			loadingPath = '';// снимаем признак загрузки
		});
	}
}

const store = new PageStore();
export default store;