import { gql } from '@apollo/client';

export const GET_FEATURED_ANIMATIONS = gql`
  query FeaturedPublicAnimations($first: Int) {
    featuredPublicAnimations(first: $first) {
      edges {
        node {
          gifUrl
          id
          jsonUrl
          name
        }
      }
    }
  }
`;
