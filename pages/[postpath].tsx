import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const referringURL = ctx.req.headers?.referer || null;
	return {
		props: {
			referringURL,
		},
	};
};

interface PostProps {
	referringURL?: string;
}

const Post: React.FC<PostProps> = (props) => {
	const router = useRouter();
	const { postpath } = router.query;

	return (
		<>
			<p>ReferringUrl: {props.referringURL || ''}</p>
			<p>Post: {postpath}</p>
			<p>fbclid: {router.query.fbclid}</p>
		</>
	);
};

export default Post;
