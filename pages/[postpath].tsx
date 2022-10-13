import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const endpoint = process.env.GRAPHQL_ENDPOINT as string;
	const graphQLClient = new GraphQLClient(endpoint);
	const referringURL = ctx.req.headers?.referer || null;
	const path = ctx.query.postpath;
	const fbclid = ctx.query.fbclid;

	// redirect if facebook is the referer or request contains fbclid
	if (
		referringURL === 'https://l.facebook.com/' ||
		referringURL === 'https://m.facebook.com/' ||
		referringURL === 'https://mobile.facebook.com/' ||
		referringURL === 'https://touch.facebook.com/' ||
		referringURL === 'https://web.facebook.com/' ||
		referringURL === 'https://lm.facebook.com/' ||
		fbclid
	) {
		return {
			redirect: {
				permanent: false,
				destination: `${endpoint.replace(/(\/graphql\/)/, '/') + path}`,
			},
		};
	}
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
	if (!data.post) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			path,
			post: data.post,
			host: ctx.req.headers.host,
			endpoint: endpoint,
		},
	};
};

interface PostProps {
	post: any;
	host: string;
	path: string;
	endpoint: string;
}

const Post: React.FC<PostProps> = (props) => {
	const { post, endpoint, host, path } = props;

	// to remove tags from excerpt
	const removeTags = (str: string) => {
		if (str === null || str === '') return '';
		else str = str.toString();
		return str.replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
	};

	return (
		<>
			<Head>
				<meta property="og:title" content={post.title} />
				<link rel="canonical" href={`https://${host}/${path}`} />
				<meta property="og:description" content={removeTags(post.excerpt)} />
				<meta property="og:url" content={`https://${host}/${path}`} />
				<meta property="og:type" content="article" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:site_name" content={host.split('.')[0]} />
				<meta property="article:published_time" content={post.dateGmt} />
				<meta property="article:modified_time" content={post.modifiedGmt} />
				<meta
					property="og:image"
					content={`${
						endpoint.replace(/(\/graphql\/)/, '') + post.featuredImage.node.uri
					}`}
				/>
				<meta
					property="og:image:alt"
					content={post.featuredImage.node.altText || post.title}
				/>
			</Head>
			<h1>{post.title}</h1>
			<img
				src={
					endpoint.replace(/(\/graphql\/)/, '') + post.featuredImage.node.uri
				}
				alt={post.featuredImage.node.altText || post.title}
			/>
			<p>{removeTags(post.excerpt)}</p>
		</>
	);
};

export default Post;
