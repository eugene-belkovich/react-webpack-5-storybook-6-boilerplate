import React from 'react';

import Button from './Button';

//π This default export determines where your story goes in the story list
export default {
  title: 'Button',
  component: Button,
};

//π We create a βtemplateβ of how args map to rendering
const Template = (args) => (
  <Button
    {...args}
    onClick={() => {
      console.log('test');
    }}
  >
    Button
  </Button>
);

/*π FirstStory will appear as First Story in the tree */
export const FirstStory = Template.bind({});

FirstStory.args = {
  /*π The args you need here will depend on your component */
  content: 'Button',
};
