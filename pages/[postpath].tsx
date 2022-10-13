import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const endpoint = process.env.GRAPHQL_ENDPOINT as string;
	const graphQLClient = new GraphQLClient(endpoint);
	const query = gql`
		{
			post(id: "/${ctx.query.postpath}/", idType: URI) {
				id
				excerpt
				title
				link
				dateGmt
				modifiedGmt
				author {
					node {
						name
					}
				}
				featuredImage {
					node {
						uri
						altText
					}
				}
			}
		}
	`;

	const data = await graphQLClient.request(query);

	const referringURL = ctx.req.headers?.referer || null;
	return {
		props: {
			referringURL,
			post: data.post,
			fbclid: ctx.query.fbclid || null,
			host: ctx.req.headers.host,
			path: ctx.query.postpath,
			endpoint: endpoint,
		},
	};
};

interface PostProps {
	referringURL?: string;
	post: any;
	host: string;
	fbclid?: string | null;
	path: string;
	endpoint: string;
}

const Post: React.FC<PostProps> = (props) => {
	const { post, referringURL, endpoint, host, path } = props;
	console.log(post);
	const removeTags = (str: string) => {
		if (str === null || str === '') return '';
		else str = str.toString();
		return str.replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
	};
	return (
		<>
			<Head>
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={removeTags(post.excerpt)} />
				<meta property="og:url" content={`https://${host}/${path}`} />
				<meta property="og:type" content="article" />
				<meta property="og:site_name" content={host.split('.')[0]} />
				<meta
					property="og:image"
					content={`${
						endpoint.replace(/(\/graphql\/)/, '') + post.featuredImage.node.uri
					}`}
				/>
			</Head>
			<h1>Post page</h1>
		</>
	);
};

export default Post;
