# Code Search

This is a scoped application for Service-now to allow easier searching all code sources.

[![](screenshot.png)](https://github.com/jacebenson/servicenow-codesearch/blob/docs/demo.mp4)

## Features

- Table of contents of results
- Inline code that is found

## Setup (Studio)

1. Open Studio on your environment
1. Import from source
1. Paste in the following url: `https://github.com/jacebenson/servicenow-codesearch.git`

### Setup (Update set)

1. Open Retrieved Update Sets
1. Import from XML
1. Attach xml file from `/dist` folder or from [Share](https://developer.servicenow.com/app.do#!/share/contents/7596230_code_share_for_sp?v=2.3&t=PRODUCT_DETAILS)
1. Preview Update Set
1. Commit Update Set

## Usage

After you import this you can start to use it by in the following ways;

- Navigating to `/code` on your instance and typing in your term
- Navigating to `/code?q=getMyApprovals` on your instance and waiting for it's response
