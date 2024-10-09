//To ensure that the RecipeItem component renders correctly with given props

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import RecipeItem from '../components/RecipeItem';

test('renders recipe item', () => {
  const recipe = { title: 'Vegan Pancakes', image_url: '/pancakes.jpg' };
  render(<RecipeItem recipe={recipe} />);
  expect(screen.getByText(/Vegan Pancakes/i)).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', '/pancakes.jpg');
});