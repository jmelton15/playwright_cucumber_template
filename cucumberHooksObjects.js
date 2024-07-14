/**
 * {
  gherkinDocument: {
    feature: {
      tags: [Array],
      location: [Object],
      language: 'en',
      keyword: 'Feature',
      name: 'DMP Test Scenarios',
      description: '',
      children: [Array]
    },
    comments: [],
    uri: 'src\\test\\features\\DMP.feature'
  },
  pickle: {
    id: '974f6d6e-70c0-4e74-bf5a-af9781afe190',
    uri: 'src\\test\\features\\DMP.feature',
    astNodeIds: [ '88a3618d-388a-4088-8214-601ae15691fa' ],
    tags: [ [Object], [Object] ],
    name: 'TC1',
    language: 'en',
    steps: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ]
  },
  pickleStep: {
    id: '8c18d607-5a82-4951-8a24-c78bc98177b8',
    text: 'DMP See if Create New Button is Visible',
    type: 'Action',
    astNodeIds: [ 'c9596890-53e2-4277-a868-5dd62de4a696' ]
  },
  testCaseStartedId: 'e8b3fdc3-4b8d-470e-befc-6d16f7064fd6',
  testStepId: '451eb813-8c14-48be-a31e-f50b5c139c04',
  result: {
    duration: { seconds: 30, nanos: 16720599 },
    status: 'FAILED',
    message: 'page.waitForSelector: Timeout 30000ms exceeded.\n' +
      'Call log:\n' +
      "  \x1B[2m- waiting for locator('asdkjfhadsk') to be visible\x1B[22m\n" +
      '\n' +
      '    at BasePage.waitForSelector (C:\\AppSec\\Playwright\\JWT_Test\\src\\pageObject\\BasePage.js:237:28)\n' +
      '    at BasePage.verifyElementExists (C:\\AppSec\\Playwright\\JWT_Test\\src\\pageObject\\BasePage.js:146:18)\n' +
      '    at World.<anonymous> (C:\\AppSec\\Playwright\\JWT_Test\\src\\test\\steps\\DMPSteps.js:30:17)',
    exception: {
      type: 'Error',
      message: 'page.waitForSelector: Timeout 30000ms exceeded.\n' +
        'Call log:\n' +
        "  \x1B[2m- waiting for locator('asdkjfhadsk') to be visible\x1B[22m\n",
      stackTrace: '    at BasePage.waitForSelector (C:\\AppSec\\Playwright\\JWT_Test\\src\\pageObject\\BasePage.js:237:28)\n' +
        '    at BasePage.verifyElementExists (C:\\AppSec\\Playwright\\JWT_Test\\src\\pageObject\\BasePage.js:146:18)\n' +
        '    at World.<anonymous> (C:\\AppSec\\Playwright\\JWT_Test\\src\\test\\steps\\DMPSteps.js:30:17)'
    }
  }
}
 */



/**
 * {
  feature: {
    tags: [ [Object] ],
    location: { line: 2, column: 1 },
    language: 'en',
    keyword: 'Feature',
    name: 'DMP Test Scenarios',
    description: '',
    children: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ]
  },
  comments: [],
  uri: 'src\\test\\features\\DMP.feature'
}
 */

/**
 * PICKLE OBJECT:
 * {
  id: 'fc2a212f-cc1b-48a3-adec-5d3a0d3da186',
  uri: 'src\\test\\features\\DMP.feature',
  astNodeIds: [ '74770ed8-d5a6-437d-8cb3-317075b86d5e' ],
  tags: [
    { name: '@DMP', astNodeId: 'bc388b76-b061-41bd-b375-f152a67956f3' },
    {
      name: '@DMP-TC1',
      astNodeId: 'ef231020-a1dd-4da2-ba7c-8bff69d28f8a'
    }
  ],
  name: 'TC1',
  language: 'en',
  steps: [
    {
      id: '182b952d-7ab3-45e2-80a8-01c9fdb421f0',
      text: 'DMP Open url as "https://dmp.dtic.azureapps.cdl.af.mil"',
      type: 'Context',
      astNodeIds: [Array]
    },
    {
      id: 'f3a515b6-2fa2-4d23-84a5-84d84b957921',
      text: 'DMP sleep as 2000',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: 'ab807750-7cde-4187-b964-c8ca74d77ccb',
      text: 'DMP See if DMP Header is Visible',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: 'db9f0489-892c-4c62-8a21-45f24ce82ab9',
      text: 'DMP See if Descriptive Text is Visible',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: '72bb0f93-59f5-4bab-bf6a-8e68a6c648d7',
      text: 'DMP See if Create New Button is Visible',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: '0b13f008-b540-4b88-be03-a5f47cd7c794',
      text: 'DMP See if Import Buttons Visible',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: '47913d44-c155-4799-a873-5df978cceb18',
      text: 'DMP Click Create New Button',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: '299a0572-41a8-4514-a21e-25bff3839a21',
      text: 'DMP see if techwiki  data plan link is visible',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: '31f93093-f937-4349-be16-23fe6708b43a',
      text: 'DMP sleep as 2000',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: '252649c5-8cc7-4e76-80e0-2bcf1860a8bf',
      text: 'DMP Click On DMP Logo',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: '4425e96f-e490-4601-9ac5-124d384e1602',
      text: 'DMP sleep as 2000',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: '989939fe-fc48-42bc-8577-db07b717cf1e',
      text: 'DMP See if DMP Header is Visible',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: '9bfc321e-3e89-4afd-92bc-d48ca8b6d712',
      text: 'DMP See if Descriptive Text is Visible',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: 'bb5272ed-980a-45d4-9e62-4584e81c3bcc',
      text: 'DMP See if Create New Button is Visible',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: 'f4a94b46-8d32-46f2-9b22-5febb49edbfc',
      text: 'DMP See if Import Buttons Visible',
      type: 'Action',
      astNodeIds: [Array]
    },
    {
      id: '978e53ce-5f51-4e5a-a5dd-5bec94b53062',
      text: 'DMP see if techwiki  data plan link is visible',
      type: 'Action',
      astNodeIds: [Array]
    }
  ]
}
 * 
 */