import TimeAgo from 'javascript-time-ago'
import { Article, IFeedParams } from '../model'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)

const API_URL = '/api/fetcher.php';

const handleFetch = async (query: string): Promise<Article[]> => {
    const url = API_URL + query; 

    const isValid = (a: Article) => a.type === 'article' && !!a.fields.thumbnail;
    const handleArticle = (a: Article) => {
        a.timeAgo = new TimeAgo('en-US').format(new Date(a.webPublicationDate));
        a.fields.trailText = a.fields.trailText.replace(/<\/?[^>]+(>|$)/g, '');
        return a;
    };

    return fetch(url)
        .then(async (response) => {
            if (response.ok) {
                const json = await response.json();
                return (json?.response?.results || [])
                    .filter(isValid)
                    .map(handleArticle);
            }
            throw new Error(response?.statusText);
        })
        .catch(() => {
            return [];
        });
};

export const fetchArticle = (id: string): Promise<Article> => {
    const query = `?show-fields=thumbnail,trailText,headline,byline,body&ids=${id}`
    return handleFetch(query).then((r) => r[0])
}

export const fetchArticleFeed = (
    params: IFeedParams,
    index: number = 1
): Promise<Article[]> => {
    const { section, searchTerm } = params
    let query = `?show-fields=thumbnail,trailText,headline&page-size=20&page=${index}`

    if (section && section !== 'latest') {
        query += '&section=' + section
    }
    if (searchTerm) {
        query += '&q=' + searchTerm
    }
    return handleFetch(query)
}
