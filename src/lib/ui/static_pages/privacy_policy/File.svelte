<!-- 
        <div 
            class="transition-all duration-500 ease-in-out overflow-hidden"
            style="
                max-height: {shouldShowImpressum ? '500px' : '0'};
                opacity: {shouldShowImpressum ? 1 : 0};
                overflow-y: {shouldShowImpressum ? 'auto' : 'hidden'};
                transition: max-height 500ms ease-in-out 400ms, opacity 500ms ease-in-out 400ms, overflow-y 500ms ease-in-out 400ms;
            "
        >
            {#if impressum.length > 0}
                {#each impressum as i}
                    <div class="transition-all duration-500 ease-in-out">
                        <div 
                            class="text-xs tracking-tight leading-relaxed overflow-y-auto"
                            style="
                                padding: {shouldShowImpressum ? '1rem' : '0'};
                                max-height: {shouldShowImpressum ? '400px' : '0'};
                                transition: padding 500ms ease-in-out 500ms, max-height 500ms ease-in-out 500ms;
                            "
                        >
                            <p>This website is operated by {i.name}, residing at {i.street}, {i.postal_code} {i.city}, {i.country}. 
                                Contact can be made via email at {i.mail_prefix} [at] {i.mail_suffix}. This is a private project 
                                with no commercial registration required. The content of this website is editorially managed by the site operator.
                            </p><br><p>
                                <span class="font-semibold">Data Processing:</span>
                                This website does not actively collect, store, or process any personal data of visitors. We do not track user behavior, 
                                maintain user profiles, or collect personal information through forms, analytics tools, or other means.
                            </p><br><p>
                                <span class="font-semibold">Cookies:</span>
                                The website utilizes only strictly necessary cookies that are essential for the technical operation of the site. 
                                These cookies are set by Pocketbase (our backend system) and are used solely for session management and to maintain 
                                administrative functions. These cookies do not contain any personal data and are 
                                automatically deleted after 24 hours of inactivity. No tracking cookies or third-party cookies are used or set by the site-operator.
                            </p><br><p>
                                <span class="font-semibold">Server Location:</span>
                                All technical infrastructure is hosted within the European Union on servers operated by Hetzner Online GmbH in 
                                Germany, ensuring compliance with EU data protection standards.
                            </p><br><p>
                                <span class="font-semibold">Data Rights:</span>
                                Since no personal data is collected from visitors, the standard data subject rights under the GDPR (right to access, 
                                rectification, erasure, restriction, portability, and objection) do not apply to typical website usage. 
                                If you have any questions about data processing, please contact us using the information provided above.
                            </p><br><p>
                                <span class="font-semibold">Legal Basis:</span>
                                The minimal data processing that occurs (session cookies for authenticated users) is based on Article 6(1)(f) GDPR, 
                                representing a legitimate interest in ensuring the security and functionality of the website.
                            </p><br><p>
                                No warranty is provided for the content on this website. The operator of this website is not responsible for the 
                                content of linked pages (e.g., GitHub, podcast feeds, etc.). Liability is excluded.
                            </p><br><p>
                                <span class="font-semibold">Questions:</span>
                                For any questions regarding data protection, please contact us using the information provided above.
                            </p>
                        </div>
                    </div>
                {/each}
            {/if}
        </div> -->