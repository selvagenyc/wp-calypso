/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BusinessATStep } from '../business-at-step';

const noop = () => {};

describe( 'rendering translated content', () => {
	const translate = jest.fn( ( content ) => content );

	test( 'should render translated heading content', () => {
		const { container } = render(
			<BusinessATStep recordTracksEvent={ noop } translate={ translate } />
		);
		expect( translate ).toHaveBeenCalled();
		expect( container.firstChild ).toHaveTextContent( 'New! Install Custom Plugins and Themes' );
	} );

	test( 'should render translated link content', () => {
		render( <BusinessATStep recordTracksEvent={ noop } translate={ translate } /> );
		expect( translate ).toHaveBeenCalled();
		expect( screen.queryByRole( 'group' ) ).toHaveTextContent(
			'Have a theme or plugin you need to install to build the site you want? ' +
				'Now you can! ' +
				'Learn more about {{pluginLink}}installing plugins{{/pluginLink}} and ' +
				'{{themeLink}}uploading themes{{/themeLink}} today.'
		);
	} );

	test( 'should render translated confirmation content', () => {
		render( <BusinessATStep recordTracksEvent={ noop } translate={ translate } /> );
		expect( translate ).toHaveBeenCalled();
		expect(
			screen.getByText(
				'Are you sure you want to cancel your subscription and lose access to these new features?'
			)
		).toBeVisible();
	} );
} );

describe( 'rendered links', () => {
	afterEach( () => {
		jest.clearAllMocks();
	} );

	const translate = ( content, params ) => {
		if ( params && params.components ) {
			return (
				<>
					{ params.components.pluginLink }
					{ params.components.themeLink }
				</>
			);
		}
		return content;
	};
	const recordTracksEvent = jest.fn();
	const user = userEvent.setup();

	test( 'should fire tracks event for plugin support link when clicked', async () => {
		render( <BusinessATStep translate={ translate } recordTracksEvent={ recordTracksEvent } /> );
		const link = screen.queryAllByRole( 'link' )[ 0 ];

		link.addEventListener( 'click', ( event ) => event.preventDefault(), false );
		await user.click( link );

		expect( recordTracksEvent ).toHaveBeenCalledWith(
			'calypso_cancellation_business_at_plugin_support_click'
		);
	} );

	test( 'should fire tracks event for theme support link when clicked', async () => {
		render( <BusinessATStep translate={ translate } recordTracksEvent={ recordTracksEvent } /> );
		const link = screen.queryAllByRole( 'link' )[ 1 ];

		link.addEventListener( 'click', ( event ) => event.preventDefault(), false );
		await user.click( link );

		expect( recordTracksEvent ).toHaveBeenCalledWith(
			'calypso_cancellation_business_at_theme_support_click'
		);
	} );
} );
