import {
	Gridicon,
	SitesTableSortOptions,
	SitesTableSortKey,
	SitesTableSortOrder,
} from '@automattic/components';
import styled from '@emotion/styled';
import { Button, Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import { createHigherOrderComponent, useMediaQuery } from '@wordpress/compose';
import { useI18n } from '@wordpress/react-i18n';
import { ComponentType, useMemo } from 'react';
import { useAsyncPreference } from 'calypso/state/preferences/use-async-preference';
import { SMALL_MEDIA_QUERY } from '../utils';

const SortingButton = styled( Button )( {
	alignSelf: 'stretch',
	flexDirection: 'row-reverse',
	gap: '4px',
	whiteSpace: 'nowrap',
} );

const SortingButtonIcon = styled( Gridicon )( {
	marginRight: '0 !important',
} );

const SEPARATOR = '-' as const;

type SitesSorting = `${ SitesTableSortKey }${ typeof SEPARATOR }${ SitesTableSortOrder }`;

const DEFAULT_SITES_SORTING = {
	sortKey: 'updatedAt',
	sortOrder: 'desc',
} as const;

export const parseSitesSorting = ( sorting: SitesSorting | 'none' ) => {
	if ( sorting === 'none' ) {
		return DEFAULT_SITES_SORTING;
	}

	const [ sortKey, sortOrder ] = sorting.split( SEPARATOR );

	return {
		sortKey: sortKey as SitesTableSortKey,
		sortOrder: sortOrder as SitesTableSortOrder,
	};
};

export const stringifySitesSorting = (
	sorting: Required< SitesTableSortOptions >
): SitesSorting => {
	return `${ sorting.sortKey }-${ sorting.sortOrder }`;
};

export const useSitesSorting = (): WithSitesSortingPreferenceProps => {
	const [ sitesSorting, onSitesSortingChange ] = useAsyncPreference< SitesSorting >( {
		defaultValue: stringifySitesSorting( DEFAULT_SITES_SORTING ),
		preferenceName: 'sites-sorting',
	} );

	return {
		hasSitesSortingPreferenceLoaded: sitesSorting !== 'none',
		sitesSorting: parseSitesSorting( sitesSorting ),
		onSitesSortingChange,
	};
};

type SitesSortingDropdownProps = WithSitesSortingPreferenceProps;

export const SitesSortingDropdown = ( {
	onSitesSortingChange,
	sitesSorting,
	hasSitesSortingPreferenceLoaded,
}: SitesSortingDropdownProps ) => {
	const isSmallScreen = useMediaQuery( SMALL_MEDIA_QUERY );
	const { __ } = useI18n();

	const label = useMemo( () => {
		if ( ! hasSitesSortingPreferenceLoaded ) {
			return null;
		}

		switch ( stringifySitesSorting( sitesSorting ) ) {
			case `lastInteractedWith${ SEPARATOR }desc`:
				return __( 'Sorted automagically' );

			case `alphabetically${ SEPARATOR }asc`:
				return __( 'Sorted alphabetically' );

			case `updatedAt${ SEPARATOR }desc`:
				return __( 'Sorted by last published' );

			default:
				throw new Error( `invalid sort value ${ sitesSorting }` );
		}
	}, [ __, sitesSorting, hasSitesSortingPreferenceLoaded ] );

	if ( ! hasSitesSortingPreferenceLoaded ) {
		return null;
	}

	return (
		<Dropdown
			position={ isSmallScreen ? 'bottom left' : 'bottom center' }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<SortingButton
					icon={ <SortingButtonIcon icon={ isOpen ? 'chevron-up' : 'chevron-down' } /> }
					iconSize={ 16 }
					onClick={ onToggle }
					aria-expanded={ isOpen }
				>
					{ label }
				</SortingButton>
			) }
			renderContent={ ( { onClose } ) => (
				<MenuGroup>
					<MenuItem
						onClick={ () => {
							onSitesSortingChange( `alphabetically${ SEPARATOR }asc` );
							onClose();
						} }
					>
						{ __( 'Alphabetically' ) }
					</MenuItem>
					<MenuItem
						onClick={ () => {
							onSitesSortingChange( `lastInteractedWith${ SEPARATOR }desc` );
							onClose();
						} }
					>
						{ __( 'Automagically' ) }
					</MenuItem>
					<MenuItem
						onClick={ () => {
							onSitesSortingChange( `updatedAt${ SEPARATOR }desc` );
							onClose();
						} }
					>
						{ __( 'Last published' ) }
					</MenuItem>
				</MenuGroup>
			) }
		/>
	);
};

export interface WithSitesSortingPreferenceProps {
	hasSitesSortingPreferenceLoaded: boolean;
	onSitesSortingChange( newValue: SitesSorting ): void;
	sitesSorting: Required< SitesTableSortOptions >;
}

export const withSitesSortingPreference = createHigherOrderComponent(
	< OuterProps, >( Component: ComponentType< OuterProps > ) => {
		const ComponentWithSitesSorting: ComponentType<
			Omit< OuterProps, keyof WithSitesSortingPreferenceProps >
		> = ( props ) => {
			return <Component { ...( props as OuterProps ) } { ...useSitesSorting() } />;
		};

		return ComponentWithSitesSorting;
	},
	'withSitesSortingPreference'
);
