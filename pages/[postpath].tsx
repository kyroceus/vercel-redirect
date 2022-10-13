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
		},
	};
};

interface PostProps {
	referringURL?: string;
	post: any;
	host: string;
	fbclid?: string | null;
	path: string;
}

const Post: React.FC<PostProps> = (props) => {
	const { post, referringURL, host, path } = props;
	return (
		<>
			<Head>
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={post.excerpt} />
				<meta property="og:url" content={`https://${host}/${path}`} />
				<meta property="og:type" content="article" />
				<meta property="og:site_name" content={host.split('.')[0]} />
				<meta property="og:image" content={post.featuredImage.node.uri} />
			</Head>
			<h1>Post page</h1>
		</>
	);
};

export default Post;
