// Adapts route paths to also include wildcard
// subroutes under the root level section.
export function pathToRegExp( path ) {
	// Prevents root level double dash urls from being validated.
	if ( path === '/' ) {
		return path;
	}
	return new RegExp( '^' + path + '(/.*)?$' );
}

export function redirectToLaunchpad( siteSlug, launchpadFlow ) {
	window.location.replace( `/setup/launchpad?flow=${ launchpadFlow }&siteSlug=${ siteSlug }` );
}

/**
 * The function calculates does the user fall into
 * the provided percentage of people for product sampling?
 *
 * @param userId Number
 * @param percentage Number
 * @returns {boolean}
 */
export function isEligibleForProductSampling( userId, percentage ) {
	if ( percentage >= 100 ) return true;
	const userSegment = userId % 100;

	return userSegment < percentage;
}
