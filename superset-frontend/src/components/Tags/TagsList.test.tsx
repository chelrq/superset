/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { render, waitFor } from 'spec/helpers/testing-library';
import TagsList, { TagsListProps } from './TagsList';

const testTags = [
  {
    name: 'example-tag1',
    id: 1,
  },
  {
    name: 'example-tag2',
    id: 2,
  },
  {
    name: 'example-tag3',
    id: 3,
  },
  {
    name: 'example-tag4',
    id: 4,
  },
  {
    name: 'example-tag5',
    id: 5,
  },
];

// Tags for testing alphabetical sorting
const unsortedTags = [
  {
    name: 'Zebra',
    id: 1,
  },
  {
    name: 'apple',
    id: 2,
  },
  {
    name: 'Banana',
    id: 3,
  },
  {
    name: 'cherry',
    id: 4,
  },
  {
    name: 'Date',
    id: 5,
  },
];

const mockedProps: TagsListProps = {
  tags: testTags,
  onDelete: undefined,
  maxTags: 5,
};

const getElementsByClassName = (className: string) =>
  document.querySelectorAll(className)! as NodeListOf<HTMLElement>;

const findAllTags = () => waitFor(() => getElementsByClassName('.ant-tag'));

test('should render', () => {
  const { container } = render(<TagsList {...mockedProps} />);
  expect(container).toBeInTheDocument();
});

test('should render 5 elements', async () => {
  render(<TagsList {...mockedProps} />);
  const tagsListItems = await findAllTags();
  expect(tagsListItems).toHaveLength(5);
  expect(tagsListItems[0]).toHaveTextContent(testTags[0].name);
  expect(tagsListItems[1]).toHaveTextContent(testTags[1].name);
  expect(tagsListItems[2]).toHaveTextContent(testTags[2].name);
  expect(tagsListItems[3]).toHaveTextContent(testTags[3].name);
  expect(tagsListItems[4]).toHaveTextContent(testTags[4].name);
});

test('should render 3 elements when maxTags is set to 3', async () => {
  render(<TagsList {...mockedProps} maxTags={3} />);
  const tagsListItems = await findAllTags();
  expect(tagsListItems).toHaveLength(3);
  expect(tagsListItems[2]).toHaveTextContent('+3...');
});

test('should sort tags alphabetically (case-insensitive)', async () => {
  render(<TagsList tags={unsortedTags} />);
  const tagsListItems = await findAllTags();
  expect(tagsListItems).toHaveLength(5);
  // Expected alphabetical order (case-insensitive): apple, Banana, cherry, Date, Zebra
  expect(tagsListItems[0]).toHaveTextContent('apple');
  expect(tagsListItems[1]).toHaveTextContent('Banana');
  expect(tagsListItems[2]).toHaveTextContent('cherry');
  expect(tagsListItems[3]).toHaveTextContent('Date');
  expect(tagsListItems[4]).toHaveTextContent('Zebra');
});

test('should maintain alphabetical order with maxTags', async () => {
  render(<TagsList tags={unsortedTags} maxTags={3} />);
  const tagsListItems = await findAllTags();
  expect(tagsListItems).toHaveLength(3);
  // Should show first 2 alphabetically sorted tags and the +3... indicator
  expect(tagsListItems[0]).toHaveTextContent('apple');
  expect(tagsListItems[1]).toHaveTextContent('Banana');
  expect(tagsListItems[2]).toHaveTextContent('+3...');
});

test('should maintain stable sort order for identical names', async () => {
  const duplicateTags = [
    { name: 'Tag', id: 1 },
    { name: 'tag', id: 2 },
    { name: 'TAG', id: 3 },
    { name: 'TaG', id: 4 },
  ];
  render(<TagsList tags={duplicateTags} />);
  const tagsListItems = await findAllTags();
  expect(tagsListItems).toHaveLength(4);
  // All variations of "tag" should maintain their relative order
  expect(tagsListItems[0]).toHaveTextContent('Tag');
  expect(tagsListItems[1]).toHaveTextContent('tag');
  expect(tagsListItems[2]).toHaveTextContent('TAG');
  expect(tagsListItems[3]).toHaveTextContent('TaG');
});
