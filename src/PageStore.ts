import { EExchange } from 'eexchange';
export interface iPage {
	content: string;
	error?: string;
}

var page: iPage | undefined = undefined;
var loadingPath: string = ''; // страница которая грузится в данный момент
var loadedPath: string = ''; // страница которая загружена и показывается в данный момент

class PageStore {

	constructor() {
		// слушаем событие о том что кому-то нужен предзагруженный объект страницы (исключительно для SSR)
		EExchange.subscribeEvent(['page-mounted'], (t) => {
			if (page !== undefined) EExchange.raiseEvent({ name: 'page-loaded', initiator: this, data: page });
		});/**/
	}

	load(path: string) {
		const url = (path === '/') ? 'index.json' : '';

		//console.log('loadPage(path):', path, url);

		// 1 отсекаем если мы уже грузим эту страницу
		if (path === loadingPath) return;

		// 2 отсекаем если эта страница загружена в данный момент и мы не в состояни загрузки
		if (loadingPath === '' && path === loadedPath) return;


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
			EExchange.raiseEvent({ name: 'page-loaded', initiator: this, data: page });
		}).catch(err => {

			EExchange.raiseEvent({ name: 'page-loaded', initiator: this, data: { content: '', error: JSON.stringify(err.name) } });

			//console.error('load data error', JSON.stringify(err.name));
		}).finally(() => {
			loadingPath = '';// снимаем признак загрузки
		});
	}
}

const store = new PageStore();
export default store;